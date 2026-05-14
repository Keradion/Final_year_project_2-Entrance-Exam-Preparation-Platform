/**
 * Seed Grade 9 Mathematics (Natural stream, MoE-aligned curriculum data).
 *
 * Usage:
 *   node scripts/scripts/seed-new.js           # insert (fails if subject already exists)
 *   node scripts/scripts/seed-new.js --reset   # remove existing Grade 9 Math Natural + re-seed
 *
 * Requires MONGODB_URI or DATABASE_URL in backend/.env.
 * Topic videos: one curated YouTube URL per topic (`TOPIC_YOUTUBE_VIDEO_IDS` in grade9SeedContent.js; no API).
 *
 * Topics are stored with MoE-style labels: chapter 1 → 1.1, 1.2, …; chapter 2 → 2.1, 2.2, …
 * Each topic gets study notes (Concept), **seven** MCQ exercises, and **five** university-entrance-style exam MCQs (linked to papers by year for metadata only).
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const { connectDB } = require('../../src/config/database');
const curriculum = require('./data/grade9MathematicsCurriculum');
const { exercisesForTopic, buildTopicStudyNotes, pickRandomTopicVideo } = require('./data/grade9SeedContent');
const { buildExamQuestionsForTopic } = require('./data/grade9ExamQuestions');
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
  ExamPaper,
  ExamQuestion,
  Issue,
  SubjectProgress,
} = require('../../src/models');

const RESET = process.argv.includes('--reset');

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
  await ExamPaper.deleteMany({ subject: subject._id });
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
  let examQuestionCount = 0;

  const examPaperByYear = {};
  for (const year of [2014, 2015, 2016, 2017, 2018]) {
    const paper = await ExamPaper.create({
      subject: subject._id,
      createdBy,
      year,
      title: 'University Entrance Exam',
    });
    examPaperByYear[year] = paper._id;
  }

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

      const v = pickRandomTopicVideo({
        chapterIndex: chIdx,
        topicIndex: tIdx,
        topicName: t.topicName,
        gradeLevel: curriculum.gradeLevel,
      });
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

      const examItems = buildExamQuestionsForTopic({
        chapterIndex: chIdx,
        topicIndex: tIdx,
        topicName: t.topicName,
      });
      const examYears = [2014, 2015, 2016, 2017, 2018];
      for (let ei = 0; ei < examItems.length; ei += 1) {
        const eq = examItems[ei];
        const paperId = examPaperByYear[examYears[ei]];
        await ExamQuestion.create({
          examPaper: paperId,
          topic: topic._id,
          questionText: eq.questionText,
          choices: eq.choices,
          correctAnswer: eq.correctAnswer,
          answerExplanation: eq.answerExplanation || '',
        });
        examQuestionCount += 1;
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
  console.log(`   Exam questions (5 per topic, university entrance style): ${examQuestionCount}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => mongoose.disconnect());
