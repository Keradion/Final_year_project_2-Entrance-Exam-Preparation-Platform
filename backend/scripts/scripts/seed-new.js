/**
 * Seed Grade 9 Mathematics (Natural stream, MoE-aligned curriculum data).
 *
 * Usage:
 *   node scripts/scripts/seed-new.js           # insert (fails if subject already exists)
 *   node scripts/scripts/seed-new.js --reset   # remove existing Grade 9 Math Natural + re-seed
 *
 * Requires MONGODB_URI or DATABASE_URL in backend/.env.
 * Optional: YOUTUBE_API_KEY — required for curriculum search. Videos must meet YOUTUBE_MIN_VIEWS (default 500000).
 *
 * Topics are stored with MoE-style labels: chapter 1 → 1.1, 1.2, …; chapter 2 → 2.1, 2.2, …
 * Each topic gets study notes (Concept) and **seven** MCQ exercises (curated + auto-padded).
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const axios = require('axios');
const mongoose = require('mongoose');
const { connectDB } = require('../../src/config/database');
const curriculum = require('./data/grade9MathematicsCurriculum');
const { exercisesForTopic, buildTopicStudyNotes } = require('./data/grade9SeedContent');
const {
  User,
  Subject,
  Chapter,
  Topic,
  Video,
  Exercise,
  ExerciseProblem,
  Quiz,
  QuizProblem,
  QuizScore,
  Concept,
  Progress,
  Bookmark,
  Question,
  ExamQuestion,
  Issue,
  SubjectProgress,
} = require('../../src/models');

const RESET = process.argv.includes('--reset');

/** Curated YouTube IDs (mostly global mathematics education) when API key is absent */
const FALLBACK_VIDEO_IDS = [
  'He1lAQxHf8k',
  'OU1yoGsMLE0',
  'RJJoLbG3JYc',
  '0jjNjIlCZ1Q',
  'e02_Nt4Z2bY',
  'NybHckSEQBI',
  '0Dd5HNx72d8',
  'kp3F3ln2FqQ',
  'L3LVtM6U8e0',
  'yJrz7wbMD5Y',
  'UepVUt8cN-M',
  'ZxKCiYuwD80',
  '8Ie8RKtsk5E',
  'cFwkLlDXvRY',
  'hB9ktmnEE2k',
  '9No_PIYh7kI',
  'pqfNSWSAdGs',
  'tyDcAc2mXeM',
  'heQRGOj26Ps',
  'L7v2FGWlKsc',
];

function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

/** Strip API keys from strings so axios/error messages do not leak secrets. */
function redactSecrets(s) {
  if (!s || typeof s !== 'string') return s;
  return s.replace(/AIzaSy[A-Za-z0-9_-]{20,}/g, '[REDACTED_KEY]');
}

/**
 * Readable YouTube API failure (never logs raw key).
 * 403 is usually: API not enabled, key restrictions block server-side calls, or wrong API on the key.
 */
function formatYouTubeFailure(err) {
  const status = err.response?.status;
  const reason = err.response?.data?.error?.message || err.response?.data?.error_message;
  const safeMsg = redactSecrets(err.message || String(err));
  let hint = '';
  if (status === 403) {
    hint =
      ' Fix 403: In Google Cloud Console — (1) Enable “YouTube Data API v3” for this project. ' +
      '(2) Credentials → your API key → “API restrictions”: choose “Restrict key” and include “YouTube Data API v3”, ' +
      'or “Don’t restrict key” for testing. ' +
      '(3) “Application restrictions”: for node scripts on your PC use “None”, or “IP addresses” with your public IP — ' +
      'not “HTTP referrers” (that blocks server/CLI).';
  } else if (status === 400) {
    hint = reason ? ` ${reason}` : '';
  }
  const parts = [`HTTP ${status || '?'}`];
  if (reason) parts.push(redactSecrets(reason));
  else parts.push(safeMsg);
  return `${parts.join(' — ')}.${hint}`;
}

function tokenizeForMatch(text) {
  const stop = new Set([
    'the',
    'and',
    'with',
    'for',
    'from',
    'into',
    'using',
    'about',
    'are',
    'this',
    'that',
    'not',
    'its',
    'per',
    'use',
    'how',
    'any',
    'all',
    'one',
    'two',
    'can',
    'has',
    'may',
    'you',
    'our',
  ]);
  const words = String(text || '')
    .toLowerCase()
    .match(/[a-z0-9]+/g) || [];
  return [...new Set(words.filter((w) => w.length > 2 && !stop.has(w)))];
}

/** Titles that look like study/lifestyle/entertainment — not lesson tutorials */
function titleIsOffTopicStrict(title) {
  const t = String(title || '').toLowerCase();
  if (!t.trim()) return true;
  return /\b(study habits|study tips|how to study|study hack|study hacks|study smarter|exam stress|test anxiety|time management tips|productivity tips|productivity hack|life hacks|life hack|morning routine|get motivated|motivational|tiktok|minecraft|fortnite|football highlights|\bnba\b|official trailer|full movie|movie clip|song lyrics|lyrics video|music video\b|breaking news|crypto\b|bitcoin\b|politics\b)\b/i.test(
    t
  );
}

const TITLE_MATH_HINTS = [
  'algebra',
  'geometry',
  'equation',
  'inequalities',
  'inequality',
  'polynomial',
  'exponents',
  'exponent',
  'radical',
  'triangle',
  'circle',
  'graph',
  'fraction',
  'decimal',
  'coordinate',
  'slope',
  'midpoint',
  'distance',
  'venn',
  'subset',
  'union',
  'intersection',
  'complement',
  'linear',
  'quadratic',
  'rational',
  'irrational',
  'absolute',
  'scientific',
  'notation',
  'factor',
  'theorem',
  'congruence',
  'congruent',
  'parallel',
  'perpendicular',
  'area',
  'volume',
  'angle',
  'polygon',
  'proof',
];

function titleHasMathCue(titleLower) {
  if (/\bsets?\b/.test(titleLower)) return true;
  return TITLE_MATH_HINTS.some((h) => titleLower.includes(h));
}

function relevanceScore(video, topicKeywords, chapterKeywords, gradeLevel) {
  const rawTitle = video.snippet?.title || '';
  if (titleIsOffTopicStrict(rawTitle)) return -100;

  const title = rawTitle.toLowerCase();
  const desc = (video.snippet?.description || '').toLowerCase();
  const blob = `${title} ${desc}`;

  let s = 0;
  for (const k of topicKeywords) {
    if (title.includes(k)) s += 4;
    else if (blob.includes(k)) s += 1;
  }
  for (const k of chapterKeywords) {
    if (title.includes(k)) s += 2;
    else if (blob.includes(k)) s += 0.5;
  }

  if (blob.includes('ethiopia') || blob.includes('ethiopian') || blob.includes('moe')) s += 2;
  const g = String(gradeLevel);
  if (
    blob.includes(`grade ${g}`) ||
    blob.includes(`grade${g}`) ||
    (blob.includes('grade') && blob.includes(g))
  ) {
    s += 2;
  }
  if (blob.includes('unit') && (blob.includes(g) || blob.includes('nine'))) s += 1;
  if (blob.includes('math') || blob.includes('mathematics') || blob.includes('maths')) s += 2;

  const topicHitInTitle = topicKeywords.some((k) => title.includes(k));
  const mathHintInTitle = titleHasMathCue(title);
  if (topicKeywords.length && !topicHitInTitle && !mathHintInTitle) s -= 5;

  return s;
}

function buildYoutubeQueries(gradeLevel, topicName, chapterName) {
  const t = topicName.trim();
  const mainPhrase = t.split(',')[0].trim().slice(0, 55);
  const unitHint = chapterName.replace(/^Unit\s*\d+:\s*/i, '').trim().slice(0, 38);
  return [
    `Ethiopia "grade ${gradeLevel}" mathematics ${mainPhrase}`,
    `Ethiopian grade ${gradeLevel} maths lesson ${mainPhrase}`,
    `"${mainPhrase}" grade ${gradeLevel} mathematics`,
    `grade ${gradeLevel} ${mainPhrase} mathematics ${unitHint}`.slice(0, 118),
  ];
}

async function youtubeSearchPage(key, query, pageToken, options = { educationCategory: true }) {
  let url =
    'https://www.googleapis.com/youtube/v3/search?' +
    'part=snippet&type=video&videoEmbeddable=true&safeSearch=moderate' +
    '&maxResults=25' +
    '&relevanceLanguage=en' +
    '&regionCode=ET' +
    `&q=${encodeURIComponent(query)}&key=${encodeURIComponent(key)}`;
  if (options.educationCategory) url += '&videoCategoryId=27';
  if (pageToken) url += `&pageToken=${encodeURIComponent(pageToken)}`;
  const { data } = await axios.get(url, { timeout: 20000 });
  return data;
}

async function mergeYoutubeSearchIntoMap(key, queries, educationCategory, byId) {
  const map = byId || new Map();
  for (const q of queries) {
    let pageToken = null;
    for (let page = 0; page < 2; page += 1) {
      const searchData = await youtubeSearchPage(key, q, pageToken, { educationCategory });
      const rawIds = (searchData.items || [])
        .map((it) => it.id?.videoId)
        .filter(Boolean);
      const details = await fetchVideoDetails(key, rawIds);
      for (const v of details) {
        if (v?.id) map.set(v.id, v);
      }
      pageToken = searchData.nextPageToken;
      if (!pageToken) break;
    }
  }
  return map;
}

async function fetchVideoDetails(apiKey, videoIds) {
  const out = [];
  const uniqueIds = [...new Set(videoIds)].filter(Boolean);
  for (let i = 0; i < uniqueIds.length; i += 50) {
    const slice = uniqueIds.slice(i, i + 50);
    if (!slice.length) continue;
    const url =
      'https://www.googleapis.com/youtube/v3/videos?' +
      `part=snippet,statistics&id=${slice.map(encodeURIComponent).join(',')}&key=${encodeURIComponent(apiKey)}`;
    const { data } = await axios.get(url, { timeout: 20000 });
    for (const item of data.items || []) {
      out.push(item);
    }
  }
  return out;
}

/**
 * Pick a video for a topic: Education category, ET region, multiple queries, relevance score + min views.
 * YOUTUBE_MIN_RELEVANCE_SCORE (default 5) drops off-topic titles before random choice among top matches.
 */
async function resolveYouTubeVideo(topicName, chapterName, gradeLevel) {
  const rawKey = process.env.YOUTUBE_API_KEY;
  const key = typeof rawKey === 'string' ? rawKey.trim() : '';
  const minViews = Math.max(0, parseInt(process.env.YOUTUBE_MIN_VIEWS || '500000', 10) || 500000);
  const minRel = Math.max(0, parseInt(process.env.YOUTUBE_MIN_RELEVANCE_SCORE || '5', 10) || 5);

  if (key) {
    try {
      const topicKeys = tokenizeForMatch(topicName);
      const chapterHint = chapterName.replace(/^Unit\s*\d+:\s*/i, '').trim();
      const chapterKeys = tokenizeForMatch(chapterHint);
      const queries = buildYoutubeQueries(gradeLevel, topicName, chapterName);
      let byId = await mergeYoutubeSearchIntoMap(key, queries, true, null);
      if (byId.size === 0) {
        console.warn(
          `[YouTube] No results with Education category for "${topicName.slice(0, 48)}"; retrying without category filter.`
        );
        byId = await mergeYoutubeSearchIntoMap(key, queries, false, null);
      }

      const candidates = [...byId.values()].filter((v) => v.statistics?.viewCount != null);
      if (candidates.length) {
        const scored = candidates.map((v) => ({
          v,
          views: parseInt(v.statistics.viewCount, 10) || 0,
          rel: relevanceScore(v, topicKeys, chapterKeys, gradeLevel),
        }));
        scored.sort((a, b) => {
          if (b.rel !== a.rel) return b.rel - a.rel;
          return b.views - a.views;
        });

        let pool = scored.filter((x) => x.rel >= minRel && x.views >= minViews && x.rel >= -1);
        if (!pool.length) {
          console.warn(
            `[YouTube] No hit with relevance≥${minRel} & views≥${minViews.toLocaleString()} for "${topicName.slice(0, 50)}" — relaxing relevance (keeping view minimum, excluding blocked titles).`
          );
          pool = scored.filter((x) => x.views >= minViews && x.rel >= -1);
        }
        if (!pool.length) {
          console.warn(
            `[YouTube] No hit with views≥${minViews.toLocaleString()} — using best available relevance (still excluding blocked titles).`
          );
          pool = scored.filter((x) => x.rel >= -1);
        }
        if (!pool.length) {
          pool = scored.slice();
        }

        const topK = pool.slice(0, Math.min(8, pool.length));
        const pickWrap = topK[Math.floor(Math.random() * topK.length)];
        const pick = pickWrap.v;
        const views = pickWrap.views;
        const titleBase = pick.snippet?.title || `${chapterName}: ${topicName}`;
        const title = `${titleBase} (${views.toLocaleString()} views; rel=${pickWrap.rel})`;
        return {
          videoUrl: `https://www.youtube.com/watch?v=${pick.id}`,
          title,
        };
      }
    } catch (e) {
      console.warn('[YouTube] API error:', formatYouTubeFailure(e));
    }
  } else {
    console.warn(
      '[YouTube] YOUTUBE_API_KEY is not set in backend/.env — using fallback videos (no view filter).'
    );
  }
  const idx =
    (hashString(`${chapterName}|${topicName}`) + hashString(String(Math.random()))) %
    FALLBACK_VIDEO_IDS.length;
  const vid = FALLBACK_VIDEO_IDS[idx];
  if (key) {
    console.warn(
      '[YouTube] Using fallback video (fix API errors above to use search + view-count filtering).'
    );
  }
  return {
    videoUrl: `https://www.youtube.com/watch?v=${vid}`,
    title: `Grade ${gradeLevel} — ${topicName}`,
  };
}

async function purgeGrade9MathNatural() {
  const subject = await Subject.findOne({
    subjectName: curriculum.subjectName,
    gradeLevel: curriculum.gradeLevel,
    stream: curriculum.stream,
  }).select('_id');
  if (!subject) return;

  const chapters = await Chapter.find({ subject: subject._id }).select('_id').lean();
  const chapterIds = chapters.map((c) => c._id);
  const topics = await Topic.find({ chapter: { $in: chapterIds } }).select('_id').lean();
  const topicIds = topics.map((t) => t._id);

  const quizzes = await Quiz.find({ topic: { $in: topicIds } }).select('_id').lean();
  const quizIds = quizzes.map((q) => q._id);
  const exercises = await Exercise.find({ topic: { $in: topicIds } }).select('_id').lean();
  const exerciseIds = exercises.map((e) => e._id);

  if (quizIds.length) {
    await QuizScore.deleteMany({ quiz: { $in: quizIds } });
    await QuizProblem.deleteMany({ quizId: { $in: quizIds } });
    await Quiz.deleteMany({ _id: { $in: quizIds } });
  }
  if (exerciseIds.length) {
    await ExerciseProblem.deleteMany({ exerciseId: { $in: exerciseIds } });
    await Exercise.deleteMany({ _id: { $in: exerciseIds } });
  }

  await Video.deleteMany({ topic: { $in: topicIds } });
  await Concept.deleteMany({ topic: { $in: topicIds } });
  await Progress.deleteMany({ topicId: { $in: topicIds } });

  const bmIds = [...topicIds, ...quizIds, ...exerciseIds];
  if (bmIds.length) await Bookmark.deleteMany({ resourceId: { $in: bmIds } });

  await Question.deleteMany({ topicId: { $in: topicIds } });
  await ExamQuestion.deleteMany({ topic: { $in: topicIds } });
  await Issue.deleteMany({ topic: { $in: topicIds } });

  await Topic.deleteMany({ _id: { $in: topicIds } });
  await Chapter.deleteMany({ _id: { $in: chapterIds } });
  await SubjectProgress.deleteMany({ subjectId: subject._id });
  await Subject.deleteOne({ _id: subject._id });

  console.log('Removed existing Grade 9 Mathematics (Natural) seed data.');
}

async function main() {
  await connectDB();

  const teacher = await User.findOne({
    $or: [{ role: 'admin' }, { role: 'teacher' }],
    status: 'active',
  }).sort({ role: 1 });

  if (!teacher) {
    console.error('No active admin/teacher user found. Run scripts/scripts/create_admin.js first.');
    process.exit(1);
  }
  const createdBy = teacher._id;
  console.log('Using createdBy user:', teacher.email, `(${teacher.role})`);

  if (RESET) await purgeGrade9MathNatural();
  else {
    const exists = await Subject.findOne({
      subjectName: curriculum.subjectName,
      gradeLevel: curriculum.gradeLevel,
      stream: curriculum.stream,
    });
    if (exists) {
      console.error(
        'Subject already exists. Run with --reset to replace, or remove it from MongoDB manually.'
      );
      process.exit(1);
    }
  }

  const subject = await Subject.create({
    subjectName: curriculum.subjectName,
    subjectDescription: curriculum.subjectDescription,
    gradeLevel: curriculum.gradeLevel,
    stream: curriculum.stream,
    teacher: null,
  });
  console.log('Subject created:', subject._id.toString());

  let topicCount = 0;
  let conceptCount = 0;
  let videoCount = 0;
  let exerciseCount = 0;
  let quizCount = 0;
  let quizProblemCount = 0;

  for (let chIdx = 0; chIdx < curriculum.chapters.length; chIdx++) {
    const ch = curriculum.chapters[chIdx];
    const chapterUnitNum = chIdx + 1;

    const chapter = await Chapter.create({
      chapterName: ch.chapterName,
      chapterDescription: ch.chapterDescription,
      subject: subject._id,
    });

    const topicDocs = [];
    for (let tIdx = 0; tIdx < ch.topics.length; tIdx++) {
      const t = ch.topics[tIdx];
      const topicLabel = `${chapterUnitNum}.${tIdx + 1}`;
      const topicNameNumbered = `${topicLabel} ${t.topicName}`;

      const topic = await Topic.create({
        topicName: topicNameNumbered,
        topicDescription: t.topicDescription,
        topicObjectives: t.topicObjectives || [],
        chapter: chapter._id,
      });
      topicDocs.push(topic);
      topicCount += 1;

      const study = buildTopicStudyNotes({
        topicLabel,
        topicName: t.topicName,
        topicDescription: t.topicDescription || '',
        chapterName: ch.chapterName,
        chapterIndex: chIdx,
        topicIndex: tIdx,
        topicObjectives: t.topicObjectives || [],
      });
      await Concept.create({
        title: study.title,
        content: study.content,
        topic: topic._id,
      });
      conceptCount += 1;

      const v = await resolveYouTubeVideo(t.topicName, ch.chapterName, curriculum.gradeLevel);
      await Video.create({
        title: `${topicLabel}: ${v.title}`,
        videoUrl: v.videoUrl,
        topic: topic._id,
      });
      videoCount += 1;

      const curated = (ch.exercises || []).filter((e) => e.topicIndex === tIdx);
      const exerciseList = exercisesForTopic(chIdx, tIdx, t.topicName, curated, 7);
      for (const ex of exerciseList) {
        await Exercise.create({
          topic: topic._id,
          title: ex.title,
          question: ex.question,
          options: ex.options,
          correctAnswer: ex.correctAnswer,
          difficulty: ex.difficulty || 'Medium',
          createdBy,
        });
        exerciseCount += 1;
      }
    }

    for (const qz of ch.quizzes) {
      const topic = topicDocs[qz.topicIndex];
      if (!topic) throw new Error(`Invalid quiz topicIndex ${qz.topicIndex} in ${ch.chapterName}`);
      const quiz = await Quiz.create({
        topic: topic._id,
        title: qz.title,
        description: `Official-style MCQ practice — ${ch.chapterName}`,
        duration: Math.min(60, Math.max(20, (qz.problems?.length || 7) * 4)),
        createdBy,
      });
      quizCount += 1;
      for (const prob of qz.problems) {
        await QuizProblem.create({
          quizId: quiz._id,
          questionText: prob.questionText,
          choices: prob.choices,
          correctAnswer: prob.correctAnswer,
          answerExplanation: prob.answerExplanation || '',
        });
        quizProblemCount += 1;
      }
    }
  }

  console.log('\n✅ Grade 9 Mathematics seed complete');
  console.log(`   Chapters: ${curriculum.chapters.length}`);
  console.log(`   Topics: ${topicCount}`);
  console.log(`   Videos: ${videoCount}`);
  console.log(`   Concepts (topic notes): ${conceptCount}`);
  console.log(`   Exercises (MCQ, 7 per topic): ${exerciseCount}`);
  console.log(`   Quizzes: ${quizCount}`);
  console.log(`   Quiz problems: ${quizProblemCount}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => mongoose.disconnect());
