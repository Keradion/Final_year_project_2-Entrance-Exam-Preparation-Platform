require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { connectDB } = require('../../src/config/database');
const axios = require('axios');
const {
  User,
  Subject,
  Chapter,
  Topic,
  Concept,
  Video,
  Exercise,
  ExerciseProblem,
  Quiz,
  QuizProblem,
  QuizScore,
  Answer,
} = require('../../src/models');

/**
 * ==================================================================================
 * Enhanced Database Seeding Script with YouTube Integration
 * ==================================================================================
 *
 * Structure: 3 subjects per stream, 5 chapters per subject, 5 topics per chapter
 * - Grades: 9, 10, 11, 12
 * - Each subject: 5 chapters
 * - Each chapter: 5 topics with concept notes, exercises, and quizzes
 * - Each topic fetches related YouTube videos
 *
 * How to run: npm run seed
 * Requires: YOUTUBE_API_KEY in .env file
 *
 * ==================================================================================
 */
const DEMO_VIDEO_URL = 'https://www.youtube.com/watch?v=IwW0GJWKH98';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';

/**
 * Fetch educational videos from YouTube for a topic
 */
async function fetchYouTubeVideos(topicName, subjectName) {
  if (!YOUTUBE_API_KEY) {
    console.log(`⚠️  No YouTube API key found. Using demo video for "${topicName}".`);
    return [DEMO_VIDEO_URL];
  }

  try {
    const searchQuery = `${topicName} educational tutorial`;
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: YOUTUBE_API_KEY,
        q: searchQuery,
        part: 'snippet',
        type: 'video',
        maxResults: 1,
        videoDuration: 'medium',
        order: 'relevance',
        relevanceLanguage: 'en',
      },
    });

    if (response.data.items && response.data.items.length > 0) {
      const videoId = response.data.items[0].id.videoId;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      console.log(`✓ Found YouTube video for "${topicName}"`);
      return [videoUrl];
    }
  } catch (error) {
    console.log(`⚠️  Could not fetch YouTube video for "${topicName}": ${error.message}`);
  }

  return [DEMO_VIDEO_URL];
}

/**
 * Generate professional HTML concept content
 */
function generateConceptContent(topicName, topicDescription, objectives) {
  const objectivesList = objectives.map(obj => `<li>${obj}</li>`).join('\n');
  return `<article lang="en">
<h1>${topicName}</h1>
<section>
  <h2>Overview</h2>
  <p>${topicDescription}</p>
</section>
<section>
  <h2>Learning Objectives</h2>
  <ul>
${objectivesList}
  </ul>
</section>
<section>
  <h2>Key Concepts</h2>
  <p>This section provides clear explanations of core concepts related to ${topicName}. Master these fundamentals to build a strong understanding of this topic area.</p>
</section>
</article>`;
}

/**
 * Generate 5 topics for a chapter based on subject
 */
function generateTopicsForChapter(subjectName) {
  const topicTemplates = {
    'Mathematics': [
      { name: 'Foundational Concepts', desc: 'Core definitions and basic principles', objs: ['Understand fundamental definitions', 'Recognize basic principles', 'Apply core concepts'] },
      { name: 'Properties and Operations', desc: 'Key properties and operational procedures', objs: ['Identify properties', 'Perform operations correctly', 'Verify results'] },
      { name: 'Problem-Solving Techniques', desc: 'Methods and strategies for systematic problem solving', objs: ['Select appropriate techniques', 'Solve standard problems', 'Justify solutions'] },
      { name: 'Real-World Applications', desc: 'Practical applications in everyday contexts', objs: ['Recognize applications', 'Model real situations', 'Interpret results'] },
      { name: 'Advanced Topics and Extensions', desc: 'Extended concepts and deeper understanding', objs: ['Extend foundational knowledge', 'Explore connections', 'Solve complex problems'] }
    ],
    'Physics': [
      { name: 'Fundamental Principles', desc: 'Basic laws and fundamental concepts', objs: ['State fundamental laws', 'Explain basic principles', 'Apply laws to situations'] },
      { name: 'Quantitative Analysis', desc: 'Mathematical treatment and numerical calculations', objs: ['Set up equations', 'Calculate values accurately', 'Analyze results'] },
      { name: 'Experimental Methods', desc: 'Laboratory techniques and measurement procedures', objs: ['Design experiments', 'Collect data accurately', 'Analyze measurements'] },
      { name: 'Applications and Case Studies', desc: 'Real-world scenarios and practical examples', objs: ['Apply concepts to scenarios', 'Analyze case studies', 'Evaluate outcomes'] },
      { name: 'Problem Analysis and Solutions', desc: 'Complex multistep problem-solving', objs: ['Analyze multistep problems', 'Develop solutions', 'Check validity'] }
    ],
    'Chemistry': [
      { name: 'Atomic and Molecular Structure', desc: 'Structure and composition of matter', objs: ['Describe atomic structure', 'Explain molecular arrangement', 'Draw structures'] },
      { name: 'Chemical Reactions and Equations', desc: 'Reaction types and proper chemical representations', objs: ['Write balanced equations', 'Classify reaction types', 'Predict products'] },
      { name: 'Stoichiometry and Calculations', desc: 'Quantitative relationships in chemistry', objs: ['Calculate quantities', 'Solve stoichiometric problems', 'Interpret ratios'] },
      { name: 'Laboratory Techniques', desc: 'Experimental procedures and safety protocols', objs: ['Perform procedures safely', 'Interpret experimental results', 'Document observations'] },
      { name: 'Industrial Applications', desc: 'Real-world chemistry in industry and life', objs: ['Apply to real situations', 'Understand industrial processes', 'Evaluate sustainability'] }
    ],
    'Biology': [
      { name: 'Cellular Structure and Function', desc: 'Cell biology fundamentals and organization', objs: ['Identify cell structures', 'Explain cellular functions', 'Compare cell types'] },
      { name: 'Genetics and Heredity', desc: 'Inheritance patterns and genetic variation', objs: ['Analyze inheritance patterns', 'Predict genetic outcomes', 'Explain variations'] },
      { name: 'Ecology and Ecosystems', desc: 'Organism-environment interactions and relationships', objs: ['Map food chains', 'Analyze ecosystem interactions', 'Evaluate biodiversity'] },
      { name: 'Evolution and Adaptation', desc: 'Natural selection and evolutionary mechanisms', objs: ['Explain evolutionary mechanisms', 'Apply evolutionary principles', 'Compare adaptations'] },
      { name: 'Human Physiology', desc: 'Body systems and homeostatic regulation', objs: ['Describe body systems', 'Explain physiological regulation', 'Analyze health topics'] }
    ],
    'Geography': [
      { name: 'Physical Features and Landforms', desc: 'Natural landscape formation and distribution', objs: ['Identify geographic features', 'Explain formation processes', 'Analyze distributions'] },
      { name: 'Climate and Weather Systems', desc: 'Atmospheric processes and climate patterns', objs: ['Describe climate patterns', 'Analyze weather data', 'Evaluate climatic changes'] },
      { name: 'Human Settlement and Urbanization', desc: 'Population distribution and urban development', objs: ['Map settlements', 'Analyze urbanization trends', 'Evaluate city growth'] },
      { name: 'Resources and Economic Activities', desc: 'Natural resources and human economic use', objs: ['Identify resource types', 'Evaluate sustainability', 'Analyze economic activities'] },
      { name: 'Development and Global Issues', desc: 'Regional disparities and contemporary challenges', objs: ['Compare development levels', 'Analyze global issues', 'Propose solutions'] }
    ],
    'Economics': [
      { name: 'Basic Economic Concepts', desc: 'Scarcity, choice, and economic decision-making', objs: ['Define economic problem', 'Calculate opportunity costs', 'Make rational decisions'] },
      { name: 'Microeconomics: Markets and Consumers', desc: 'Individual behavior and market operations', objs: ['Analyze demand and supply', 'Determine market equilibrium', 'Evaluate market efficiency'] },
      { name: 'Production and Business Economics', desc: 'Production decisions and cost management', objs: ['Calculate production costs', 'Optimize production', 'Analyze profitability'] },
      { name: 'Macroeconomics: National Economy', desc: 'Aggregate economic measures and growth', objs: ['Calculate national income', 'Analyze economic growth', 'Evaluate macro policies'] },
      { name: 'Money, Banking, and International Trade', desc: 'Financial systems and international commerce', objs: ['Explain money functions', 'Analyze banking operations', 'Understand trade patterns'] }
    ],
    'History': [
      { name: 'Historical Periods and Eras', desc: 'Chronological frameworks and historical periodization', objs: ['Understand historical periods', 'Identify key dates', 'Compare eras'] },
      { name: 'People and Leadership', desc: 'Significant figures and their contributions', objs: ['Identify key leaders', 'Explain contributions', 'Analyze impact'] },
      { name: 'Social and Political Movements', desc: 'Collective actions and institutional change', objs: ['Understand movements', 'Analyze causes', 'Evaluate outcomes'] },
      { name: 'Cultural and Intellectual Developments', desc: 'Ideas, arts, and intellectual progress', objs: ['Describe cultural changes', 'Analyze intellectual trends', 'Evaluate significance'] },
      { name: 'Historical Analysis and Interpretation', desc: 'Analyzing sources and constructing narratives', objs: ['Evaluate evidence', 'Construct arguments', 'Assess interpretations'] }
    ],
    'Civics': [
      { name: 'Rights and Responsibilities', desc: 'Individual rights and civic duties', objs: ['Define rights', 'Understand responsibilities', 'Analyze balance'] },
      { name: 'Government Structure and Process', desc: 'How government institutions function', objs: ['Describe institutions', 'Explain processes', 'Analyze relationships'] },
      { name: 'Law and Justice Systems', desc: 'Legal frameworks and judicial systems', objs: ['Understand laws', 'Explain justice', 'Analyze fairness'] },
      { name: 'Participation and Democracy', desc: 'Civic engagement and democratic processes', objs: ['Understand participation', 'Analyze democracy', 'Evaluate engagement'] },
      { name: 'Global Citizenship and Ethics', desc: 'International relations and ethical issues', objs: ['Understand global context', 'Analyze ethics', 'Develop perspective'] }
    ]
  };

  const templates = topicTemplates[subjectName] || topicTemplates['Mathematics'];
  return templates.map((t, idx) => ({
    topicName: `${t.name}`,
    topicDescription: t.desc,
    topicObjectives: t.objs,
    htmlContent: generateConceptContent(t.name, t.desc, t.objs),
    videoDuration: 600 + (idx * 90),
  }));
}

/**
 * Generate topic-specific exercises
 */
async function seedExercises(topic, subject, chapter, teacherId) {
  await Exercise.create({
    topic: topic._id,
    title: `Practice: ${topic.topicName}`,
    description: `Apply your understanding of ${topic.topicName} from ${chapter.chapterName} (${subject.subjectName}).`,
    question: `Based on the topic "${topic.topicName}", which statement accurately reflects its importance in ${subject.subjectName}?`,
    options: [
      `This topic is directly related to understanding ${topic.topicName} as required by the curriculum.`,
      `This topic is unrelated to ${topic.topicName}.`,
      `This topic is only optional enrichment material.`,
      `This topic belongs to a different subject entirely.`,
    ],
    correctAnswer: 0,
    hint: `Review the learning objectives for ${topic.topicName}.`,
    difficulty: 'Medium',
    createdBy: teacherId,
  });
}

/**
 * Generate topic-specific quizzes
 */
async function seedQuizzes(topic, subject, chapter, teacherId) {
  const quiz = await Quiz.create({
    topic: topic._id,
    title: `Check: ${topic.topicName}`,
    description: `Quick assessment of ${topic.topicName} concepts in ${chapter.chapterName}.`,
    duration: 15,
    createdBy: teacherId,
  });

  const quizItems = [
    {
      questionText: `What is the primary focus of "${topic.topicName}"?`,
      choices: [
        { text: `Understanding the concepts of ${topic.topicName}`, value: 'A' },
        { text: `Learning unrelated topics`, value: 'B' },
        { text: `General knowledge outside this subject`, value: 'C' },
        { text: `Memorizing without understanding`, value: 'D' },
      ],
      correctAnswer: 'A',
      answerExplanation: `The topic directly addresses ${topic.topicName}. Review the lesson objectives.`,
    },
    {
      questionText: `Which learning objective is directly aligned with ${topic.topicName}?`,
      choices: [
        { text: `Apply concepts and solve problems related to ${topic.topicName}`, value: 'A' },
        { text: `Learn unrelated historical facts`, value: 'B' },
        { text: `Study advanced topics beyond this level`, value: 'C' },
        { text: `Simple memorization without deep understanding`, value: 'D' },
      ],
      correctAnswer: 'A',
      answerExplanation: `Learning objectives focus on understanding and application of ${topic.topicName}.`,
    },
    {
      questionText: `How does ${topic.topicName} connect to real-world applications?`,
      choices: [
        { text: `It provides practical tools for solving real problems in ${subject.subjectName}`, value: 'A' },
        { text: `It has no practical value`, value: 'B' },
        { text: `It is purely theoretical with no applications`, value: 'C' },
        { text: `It is unrelated to everyday situations`, value: 'D' },
      ],
      correctAnswer: 'A',
      answerExplanation: `${topic.topicName} applies directly to solving real problems. Understand these applications well.`,
    },
  ];

  for (const item of quizItems) {
    await QuizProblem.create({
      quizId: quiz._id,
      questionText: item.questionText,
      questionImageUrl: null,
      choices: item.choices,
      correctAnswer: item.correctAnswer,
      answerExplanation: item.answerExplanation,
    });
  }
}

/**
 * Curriculum structure: 3 subjects per stream, per grade
 */
const CURRICULUM_STRUCTURE = {
  'Grade 9': {
    Natural: [
      { name: 'Mathematics', desc: 'Grade 9 Mathematics: Algebra, Geometry, and Functions' },
      { name: 'Physics', desc: 'Grade 9 Physics: Mechanics and Measurement' },
      { name: 'Chemistry', desc: 'Grade 9 Chemistry: Matter and Atomic Structure' },
    ],
    Social: [
      { name: 'Geography', desc: 'Grade 9 Geography: Ethiopia and World Regions' },
      { name: 'Economics', desc: 'Grade 9 Economics: Markets and Economic Systems' },
      { name: 'History', desc: 'Grade 9 History: African and Ethiopian History' },
    ],
  },
  'Grade 10': {
    Natural: [
      { name: 'Mathematics', desc: 'Grade 10 Mathematics: Trigonometry and Matrices' },
      { name: 'Physics', desc: 'Grade 10 Physics: Energy and Waves' },
      { name: 'Biology', desc: 'Grade 10 Biology: Cells and Genetics' },
    ],
    Social: [
      { name: 'Geography', desc: 'Grade 10 Geography: Population and Settlement' },
      { name: 'Economics', desc: 'Grade 10 Economics: Production and Resources' },
      { name: 'Civics', desc: 'Grade 10 Civics: Governance and Rights' },
    ],
  },
  'Grade 11': {
    Natural: [
      { name: 'Mathematics', desc: 'Grade 11 Mathematics: Advanced Algebra and Calculus' },
      { name: 'Physics', desc: 'Grade 11 Physics: Electricity and Magnetism' },
      { name: 'Chemistry', desc: 'Grade 11 Chemistry: Reactions and Equilibrium' },
    ],
    Social: [
      { name: 'Geography', desc: 'Grade 11 Geography: Development and Sustainability' },
      { name: 'Economics', desc: 'Grade 11 Economics: Growth and Inflation' },
      { name: 'History', desc: 'Grade 11 History: Modern World History' },
    ],
  },
  'Grade 12': {
    Natural: [
      { name: 'Physics', desc: 'Grade 12 Physics: Modern Physics and Relativity' },
      { name: 'Chemistry', desc: 'Grade 12 Chemistry: Organic Compounds and Reactions' },
      { name: 'Biology', desc: 'Grade 12 Biology: Ecology and Evolution' },
    ],
    Social: [
      { name: 'Geography', desc: 'Grade 12 Geography: Geopolitics and Global Issues' },
      { name: 'Economics', desc: 'Grade 12 Economics: International Trade and Finance' },
      { name: 'Civics', desc: 'Grade 12 Civics: Democracy and Development' },
    ],
  },
};

/**
 * Chapter names - same for all subjects
 */
const CHAPTER_NAMES = [
  'Chapter 1: Introduction and Foundations',
  'Chapter 2: Core Concepts and Theory',
  'Chapter 3: Methods and Techniques',
  'Chapter 4: Applications and Analysis',
  'Chapter 5: Advanced Topics and Synthesis',
];

/**
 * Seed a subject with 5 chapters and 5 topics each
 */
async function seedSubject(subject, gradeLabel, stream, teacherId) {
  const subjectDoc = await Subject.create({
    subjectName: subject.name,
    subjectDescription: subject.desc,
    gradeLevel: gradeLabel,
    stream,
    teacher: teacherId,
  });

  for (const chapterName of CHAPTER_NAMES) {
    const chapter = await Chapter.create({
      chapterName,
      chapterDescription: `${chapterName} of ${subject.name} - comprehensive coverage of core topics and applications.`,
      subject: subjectDoc._id,
    });

    const topics = generateTopicsForChapter(subject.name);
    for (const topicData of topics) {
      const topic = await Topic.create({
        topicName: topicData.topicName,
        topicDescription: topicData.topicDescription,
        topicObjectives: topicData.topicObjectives,
        chapter: chapter._id,
      });

      await Concept.create({
        title: topicData.topicName,
        content: topicData.htmlContent,
        topic: topic._id,
      });

      // Fetch YouTube video for this topic
      const videoUrls = await fetchYouTubeVideos(topicData.topicName, subject.name);
      const videoUrl = videoUrls[0] || DEMO_VIDEO_URL;

      await Video.create({
        title: topicData.topicName,
        videoUrl: videoUrl,
        videoDuration: topicData.videoDuration,
        topic: topic._id,
      });

      await seedExercises(topic, subjectDoc, chapter, teacherId);
      await seedQuizzes(topic, subjectDoc, chapter, teacherId);
    }
  }

  console.log(`  ✓ ${gradeLabel} · ${stream} · ${subject.name}`);
}

/**
 * Main seeding function
 */
const seedDatabase = async () => {
  try {
    const findOrCreateUser = async (email, userData) => {
      let user = await User.findOne({ email });
      if (!user) {
        user = new User(userData);
        await user.save();
        return user;
      }
      Object.assign(user, userData);
      await user.save();
      return user;
    };

    await connectDB();
    console.log('Database connected successfully.');

    console.log('Clearing existing data...');
    await Answer.deleteMany({});
    await QuizScore.deleteMany({});
    await QuizProblem.deleteMany({});
    await Quiz.deleteMany({});
    await ExerciseProblem.deleteMany({});
    await Exercise.deleteMany({});
    await Subject.deleteMany({});
    await Chapter.deleteMany({});
    await Topic.deleteMany({});
    await Concept.deleteMany({});
    await Video.deleteMany({});
    console.log('Data cleared.');

    console.log('Creating or finding users...');
    const admin = await findOrCreateUser('admin@example.com', {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      status: 'active',
    });

    const customAdmin = await findOrCreateUser('entranceadmin@gmail.com', {
      firstName: 'Entrance',
      lastName: 'Admin',
      email: 'entranceadmin@gmail.com',
      password: '12345Qwert@',
      role: 'admin',
      status: 'active',
    });

    const teacher = await findOrCreateUser('teacher.gebre@example.com', {
      firstName: 'Gebre',
      lastName: 'Hagos',
      email: 'teacher.gebre@example.com',
      password: 'password123',
      role: 'teacher',
      status: 'active',
    });

    const student = await findOrCreateUser('dan@gmail.com', {
      firstName: 'Dan',
      lastName: 'User',
      email: 'dan@gmail.com',
      password: '12345Qwert@',
      role: 'student',
      status: 'active',
      stream: 'Natural',
      gradeLevel: '12',
    });

    const studentSocial = await findOrCreateUser('social.student@example.com', {
      firstName: 'Social',
      lastName: 'Student',
      email: 'social.student@example.com',
      password: '12345Qwert@',
      role: 'student',
      status: 'active',
      stream: 'Social',
      gradeLevel: '12',
    });

    console.log('Users created/found successfully.');
    console.log('\nCreating comprehensive curriculum (3 subjects per stream, 5 chapters per subject, 5 topics per chapter)...');
    console.log(`YouTube API: ${YOUTUBE_API_KEY ? '✓ Configured - fetching real videos' : '⚠️  Not configured - using demo videos'}\n`);

    let subjectCount = 0;
    for (const gradeLabel of ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']) {
      console.log(`${gradeLabel}:`);

      for (const stream of ['Natural', 'Social']) {
        const subjects = CURRICULUM_STRUCTURE[gradeLabel][stream];
        console.log(`  ${stream} Stream:`);
        for (const subject of subjects) {
          await seedSubject(subject, gradeLabel, stream, teacher._id);
          subjectCount++;
        }
      }
    }

    console.log(`\n✅ Curriculum Structure Complete:`);
    console.log(`   Total Subjects: ${subjectCount}`);
    console.log(`   Chapters per subject: 5`);
    console.log(`   Topics per chapter: 5`);
    console.log(`   Total Topics: 600`);
    console.log(`   Each topic includes: concept note, YouTube video, exercise, and quiz`);
    console.log(`   Videos: ${YOUTUBE_API_KEY ? 'Real educational videos fetched from YouTube' : 'Demo videos (add YOUTUBE_API_KEY to .env for real videos)'}`);

    try {
      const { connectRedis } = require('../../src/config/redis');
      const appCache = require('../../src/services/appCache');
      await connectRedis().catch(() => {});
      await appCache.invalidateSubjectsCatalog();
      console.log('\n✓ Subject catalogue cache invalidated.');
    } catch (_err) {
      // ignore
    }

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    mongoose.disconnect();
    console.log('Database connection closed.');
  }
};

seedDatabase();

/**
 * One Ethiopian curriculum-style unit (becomes one Chapter + one Topic + Concept + Video).
 * Objectives are expressed as syllabus outcomes, not generic “soft skills”.
 */
function ethUnit(chapterName, chapterDescription, topicName, topicDescription, topicObjectives, bodyHtml) {
  return {
    chapterName,
    chapterDescription,
    topicName,
    topicDescription,
    topicObjectives,
    bodyHtml,
  };
}

function chaptersFromEthUnits(units) {
  return units.map((u, idx) => ({
    name: u.chapterName,
    description: u.chapterDescription,
    topicName: u.topicName,
    topicDescription: u.topicDescription,
    topicObjectives: u.topicObjectives,
    htmlContent: `<article lang="en"><h1>${u.topicName}</h1>${u.bodyHtml}<p><small>Placeholder seed aligned to Ethiopian secondary syllabus scope—replace with textbook-accurate materials.</small></p></article>`,
    videoUrl: DEMO_VIDEO_URL,
    videoDuration: 540 + idx * 75,
  }));
}

function choicesABCD(texts) {
  return ['A', 'B', 'C', 'D'].map((value, i) => ({ text: texts[i], value }));
}

/**
 * One MCQ exercise (frontend uses Exercise.options + correctAnswer index).
 * One Quiz per topic with three QuizProblems (choices value A–D).
 */
async function seedEthiopianAssessments(teacherId) {
  const topics = await Topic.find({})
    .populate({
      path: 'chapter',
      select: 'chapterName subject',
      populate: { path: 'subject', select: 'subjectName gradeLevel stream' },
    })
    .sort({ created_at: 1 });

  let exerciseCount = 0;
  let quizCount = 0;
  let problemCount = 0;

  for (const topic of topics) {
    const subject = topic.chapter?.subject;
    const subjName = subject?.subjectName || 'this subject';
    const grade = subject?.gradeLevel || '';
    const streamPhrase = subject?.stream ? ` (${subject.stream} stream)` : '';

    await Exercise.create({
      topic: topic._id,
      title: `Practice: ${topic.topicName}`,
      description: `Ethiopian syllabus-scope multiple-choice practice — ${subjName}, ${grade}${streamPhrase}.`,
      question:
        `${topic.topicDescription || topic.topicName}\n\n` +
        `Select the option that correctly describes this unit’s place in Ethiopian secondary preparation for ${subjName} (${grade})${streamPhrase}.`,
      options: [
        `The unit reflects MoE curriculum objectives for ${topic.topicName} within ${subjName} at ${grade}.`,
        `Examiners treat ${topic.topicName} as optional enrichment outside the syllabus.`,
        `Students may omit ${topic.topicName} when preparing for Ethiopian entrance examinations.`,
        `${topic.topicName} is taught only in non-Ethiopian school systems.`,
      ],
      correctAnswer: 0,
      hint: 'Verify the unit title against your Ministry of Education student textbook.',
      difficulty: 'Medium',
      createdBy: teacherId,
    });
    exerciseCount += 1;

    const quiz = await Quiz.create({
      topic: topic._id,
      title: `Unit check: ${topic.topicName}`,
      description: `Timed check on ${topic.topicName} — ${subjName}, ${grade}. Replace items with official past papers when available.`,
      duration: 30,
      createdBy: teacherId,
    });
    quizCount += 1;

    const goodResource = `MoE-approved textbook and teacher guide for ${subjName} (${grade}).`;
    const badSocial = 'Unmoderated social-media threads.';
    const badForeign = 'Foreign syllabi not adapted to Ethiopia.';
    const badInformal = 'Informal notes without MoE alignment.';

    const quizItems = [
      {
        questionText: `When revising "${topic.topicName}", which resource should students trust first?`,
        choices: choicesABCD([goodResource, badSocial, badForeign, badInformal]),
        correctAnswer: 'A',
        answerExplanation:
          'Ethiopian entrance preparation follows MoE-approved textbooks and supplementary guides.',
      },
      {
        questionText: `In ${grade} ${subjName}, what is the formal status of "${topic.topicName}"?`,
        choices: choicesABCD([
          badInformal,
          `Core syllabus content ${grade} students are expected to master.`,
          badForeign,
          badSocial,
        ]),
        correctAnswer: 'B',
        answerExplanation:
          'Seeded units mirror national textbook organisation; each topic is part of structured coverage.',
      },
      {
        questionText: `How should study time for "${topic.topicName}" be planned alongside other ${subjName} units?`,
        choices: choicesABCD([
          badSocial,
          badForeign,
          `Balance time across all MoE units for ${grade}, including ${topic.topicName}.`,
          'Skip all other units until this one is memorised verbatim.',
        ]),
        correctAnswer: 'C',
        answerExplanation:
          'MoE preparation assumes proportional revision across the full syllabus, not a single unit in isolation.',
      },
    ];

    for (const item of quizItems) {
      await QuizProblem.create({
        quizId: quiz._id,
        questionText: item.questionText,
        questionImageUrl: null,
        choices: item.choices,
        correctAnswer: item.correctAnswer,
        answerExplanation: item.answerExplanation,
      });
      problemCount += 1;
    }
  }

  console.log(
    `  ✓ ${exerciseCount} exercises, ${quizCount} quizzes, ${problemCount} quiz questions (${topics.length} topics).`
  );
}

/** Grade × stream × subject with exactly three MoE-style units each */
const ETHIOPIAN_CURRICULUM_SEED = [
  // --- Grade 9 ---
  {
    gradeLabel: 'Grade 9',
    stream: 'Natural',
    subjectName: 'Mathematics',
    subjectDescription: 'Ethiopian Grade 9 Mathematics (General Education Programme).',
    units: [
      ethUnit(
        'Unit 1: Sets and Real Numbers',
        'Ethiopian Grade 9 Mathematics — sets, subsets, and the real number line.',
        'Sets and operations on sets',
        'Represent sets, identify subsets, and carry out union and intersection.',
        [
          'Represent finite sets using roster and rule notation.',
          'Identify subsets and proper subsets of a given set.',
          'Perform union and intersection on pairs of sets.',
        ],
        '<p>Grade 9 introduces finite sets, subsets, union and intersection, and links sets to intervals on the real number line used later for inequalities.</p>'
      ),
      ethUnit(
        'Unit 2: Algebraic Expressions and Linear Equations',
        'Ethiopian Grade 9 Mathematics — simplifying expressions and solving linear equations in one variable.',
        'Algebraic manipulation and linear equations',
        'Expand brackets, combine like terms, and solve ax + b = c.',
        [
          'Simplify algebraic expressions by combining like terms.',
          'Expand simple products of binomials.',
          'Solve linear equations in one variable including those arising from word problems.',
        ],
        '<p>Students work with integer and rational coefficients, translate verbal statements into equations, and interpret solutions in context.</p>'
      ),
      ethUnit(
        'Unit 3: Plane Geometry',
        'Ethiopian Grade 9 Mathematics — angles, triangles, and quadrilaterals.',
        'Angles, triangles, and quadrilaterals',
        'Use angle relationships and properties of triangles and special quadrilaterals.',
        [
          'Calculate unknown angles using supplementary, complementary, and vertically opposite angles.',
          'Apply angle-sum property of triangles.',
          'Use properties of parallelograms, rectangles, and rhombuses.',
        ],
        '<p>Geometry follows the national textbook progression from angle concepts through triangle congruence criteria introduced at this level.</p>'
      ),
    ],
  },
  {
    gradeLabel: 'Grade 9',
    stream: 'Natural',
    subjectName: 'Physics',
    subjectDescription: 'Ethiopian Grade 9 Physics (introductory mechanics and measurement).',
    units: [
      ethUnit(
        'Unit 1: Physical Quantities and Measurement',
        'Ethiopian Grade 9 Physics — SI units, prefixes, and uncertainty.',
        'Measurement and SI base quantities',
        'Use SI units, conversions, and significant figures appropriate to Grade 9.',
        [
          'State SI base quantities and derived quantities relevant to mechanics.',
          'Convert units using standard prefixes.',
          'Report measurements with reasonable precision.',
        ],
        '<p>Topics align with national introductory physics: physical quantities, instruments, and systematic vs random error at conceptual level.</p>'
      ),
      ethUnit(
        'Unit 2: Motion in One Dimension',
        'Ethiopian Grade 9 Physics — kinematics along a straight line.',
        'Distance, displacement, speed, and velocity',
        'Describe uniform motion and compute average speed from distance–time data.',
        [
          'Distinguish distance from displacement and speed from velocity.',
          'Interpret distance–time and velocity–time graphs for uniform motion.',
          'Solve uniform-motion problems using consistent SI units.',
        ],
        '<p>Kinematics is restricted to one-dimensional uniform motion as set out for lower-secondary physics in Ethiopia.</p>'
      ),
      ethUnit(
        'Unit 3: Forces and Newton’s Laws (Introduction)',
        'Ethiopian Grade 9 Physics — forces as vectors and conceptual Newton laws.',
        'Types of forces and equilibrium',
        'Identify forces acting on a body and explain qualitative equilibrium.',
        [
          'Classify contact and non-contact forces encountered in daily life.',
          'State Newton’s first law qualitatively.',
          'Recognise balanced forces as equilibrium without requiring full quantitative Newton II.',
        ],
        '<p>Newton’s second law quantitatively is extended in higher grades; here emphasis is conceptual readiness consistent with MoE sequencing.</p>'
      ),
    ],
  },
  {
    gradeLabel: 'Grade 9',
    stream: 'Social',
    subjectName: 'Geography',
    subjectDescription: 'Ethiopian Grade 9 Geography — Ethiopia and basic geographic literacy.',
    units: [
      ethUnit(
        'Unit 1: Location and Major Relief of Ethiopia',
        'Ethiopian Grade 9 Geography — position, major highlands, and Rift Valley.',
        'Ethiopia’s location and landforms',
        'Describe Ethiopia’s neighbours, plate boundaries, and major physiographic regions.',
        [
          'Locate Ethiopia using latitude and longitude.',
          'Outline the Ethiopian Highlands, Rift Valley, and surrounding lowlands.',
          'Relate major relief to drainage directions.',
        ],
        '<p>Physical geography follows standard Ethiopian secondary introductions to national relief and major drainage systems.</p>'
      ),
      ethUnit(
        'Unit 2: Climate and Natural Vegetation',
        'Ethiopian Grade 9 Geography — climatic controls and vegetation belts.',
        'Climate regions and vegetation of Ethiopia',
        'Explain seasonal rainfall patterns and link vegetation zones to climate.',
        [
          'Identify controls on Ethiopian climate (altitude, latitude, monsoon circulation).',
          'Describe kiremt and belg rainfall regimes qualitatively.',
          'Match vegetation types to climatic belts.',
        ],
        '<p>Content parallels Ethiopian textbook treatments of vertical zonation and seasonal rainfall without importing foreign frameworks.</p>'
      ),
      ethUnit(
        'Unit 3: Map and Atlas Skills',
        'Ethiopian Grade 9 Geography — scales, directions, and interpretation.',
        'Working with topographic maps',
        'Use scale, legend, and contour spacing to describe terrain.',
        [
          'Calculate distances using linear scale.',
          'Determine directions using grid bearings where provided.',
          'Interpret contour patterns for ridges and valleys.',
        ],
        '<p>Practical map work reflects Ethiopian secondary geography emphasis on national atlases and school maps.</p>'
      ),
    ],
  },
  {
    gradeLabel: 'Grade 9',
    stream: 'Social',
    subjectName: 'Economics',
    subjectDescription: 'Ethiopian Grade 9 Economics — scarcity, choice, and introductory markets.',
    units: [
      ethUnit(
        'Unit 1: Scarcity, Choice, and Opportunity Cost',
        'Ethiopian Grade 9 Economics — economic problem at household level.',
        'Unlimited wants and limited resources',
        'Explain trade-offs using Ethiopian household and farm examples.',
        [
          'Define scarcity and choice.',
          'Compute opportunity cost in simple two-good situations.',
          'Give Ethiopian examples of rationing by price and tradition.',
        ],
        '<p>National curriculum introduces economics through scarcity faced by rural and urban households in Ethiopia.</p>'
      ),
      ethUnit(
        'Unit 2: Demand and Supply',
        'Ethiopian Grade 9 Economics — schedules and market price.',
        'Demand, supply, and equilibrium price',
        'Understand upward-sloping supply and downward-sloping demand.',
        [
          'Construct demand and supply schedules from tables.',
          'Identify equilibrium price and quantity in competitive markets.',
          'Describe surplus and shortage situations.',
        ],
        '<p>Uses Ethiopian market examples (grain, vegetables, fuel) consistent with textbook illustrations.</p>'
      ),
      ethUnit(
        'Unit 3: Economic Activities in Ethiopia',
        'Ethiopian Grade 9 Economics — sectors and livelihoods.',
        'Primary, secondary, and tertiary sectors',
        'Classify employment by sector using Ethiopian statistics.',
        [
          'Define primary, secondary, and tertiary activities.',
          'Identify dominant sectors in Ethiopia’s GDP composition at introductory level.',
          'Relate sector shares to regional livelihood patterns.',
        ],
        '<p>National accounts concepts appear descriptively; quantitative depth increases in later grades.</p>'
      ),
    ],
  },

  // --- Grade 10 ---
  {
    gradeLabel: 'Grade 10',
    stream: 'Natural',
    subjectName: 'Chemistry',
    subjectDescription: 'Ethiopian Grade 10 Chemistry — matter, atomic structure, bonding.',
    units: [
      ethUnit(
        'Unit 1: Classification of Matter',
        'Ethiopian Grade 10 Chemistry — elements, compounds, mixtures.',
        'Pure substances and mixtures',
        'Separate mixtures using filtration and distillation conceptually.',
        [
          'Distinguish elements from compounds and mixtures.',
          'Describe homogeneous vs heterogeneous mixtures.',
          'Relate separation techniques to particle models.',
        ],
        '<p>Ethiopian chemistry pathway begins systematic particle descriptions before quantitative stoichiometry intensifies in Grade 11.</p>'
      ),
      ethUnit(
        'Unit 2: Atomic Structure and the Periodic Table',
        'Ethiopian Grade 10 Chemistry — electrons and periodic trends.',
        'Atoms, isotopes, and periodic properties',
        'Write electron configurations for first twenty elements.',
        [
          'Describe subatomic particles and their relative masses and charges.',
          'Explain atomic number and mass number; identify isotopes.',
          'Relate group trends in metallic character and atomic radius.',
        ],
        '<p>Periodic law is taught with Ethiopian textbook periodic table conventions.</p>'
      ),
      ethUnit(
        'Unit 3: Chemical Bonding',
        'Ethiopian Grade 10 Chemistry — ionic and covalent models.',
        'Formation of ionic and covalent compounds',
        'Predict bonding type using electronegativity difference qualitatively.',
        [
          'Explain ion formation for representative metals and non-metals.',
          'Draw Lewis structures for simple molecules.',
          'Relate physical properties to bonding type.',
        ],
        '<p>Bonding treatment stays within MoE Grade 10 expectations before VSEPR extension.</p>'
      ),
    ],
  },
  {
    gradeLabel: 'Grade 10',
    stream: 'Natural',
    subjectName: 'Biology',
    subjectDescription: 'Ethiopian Grade 10 Biology — cell biology and classification.',
    units: [
      ethUnit(
        'Unit 1: Cell Structure and Organisation',
        'Ethiopian Grade 10 Biology — prokaryotic vs eukaryotic cells.',
        'The cell as the unit of life',
        'Identify organelles and their functions in plant and animal cells.',
        [
          'Compare plant and animal cells using diagrams.',
          'State functions of nucleus, mitochondria, chloroplasts, and ribosomes.',
          'Explain cell theory.',
        ],
        '<p>Microscopy outcomes match Ethiopian laboratory guides where available.</p>'
      ),
      ethUnit(
        'Unit 2: Classification of Living Organisms',
        'Ethiopian Grade 10 Biology — taxonomy and kingdoms.',
        'Binomial nomenclature and major kingdoms',
        'Use dichotomous keys for local organisms.',
        [
          'Explain hierarchy from species to kingdom.',
          'Describe distinguishing features of major kingdoms.',
          'Classify common Ethiopian plants and animals to genus level.',
        ],
        '<p>Examples prioritise Ethiopian flora and fauna referenced in national syllabus.</p>'
      ),
      ethUnit(
        'Unit 3: Nutrition and Human Health',
        'Ethiopian Grade 10 Biology — nutrients and deficiency diseases.',
        'Balanced diet and malnutrition',
        'Link dietary adequacy to national nutrition priorities.',
        [
          'List macronutrients and micronutrients with dietary sources.',
          'Identify symptoms of protein-energy malnutrition and micronutrient deficiencies.',
          'Outline Ethiopian nutrition interventions at introductory level.',
        ],
        '<p>Public-health links reflect Ethiopian Ministry of Health messaging appropriate to schools.</p>'
      ),
    ],
  },
  {
    gradeLabel: 'Grade 10',
    stream: 'Social',
    subjectName: 'Geography',
    subjectDescription: 'Ethiopian Grade 10 Geography — population and economic geography of Ethiopia.',
    units: [
      ethUnit(
        'Unit 1: Population Distribution and Growth',
        'Ethiopian Grade 10 Geography — census concepts and demographic transition.',
        'Population patterns in Ethiopia',
        'Interpret population density maps and growth rates.',
        [
          'Explain crude birth and death rates.',
          'Describe spatial contrasts between highland and lowland densities.',
          'Outline factors influencing rural–urban migration.',
        ],
        '<p>Uses Ethiopian census terminology without importing non-national classification schemes.</p>'
      ),
      ethUnit(
        'Unit 2: Settlement Geography',
        'Ethiopian Grade 10 Geography — rural and urban settlement.',
        'Settlement types and urbanisation',
        'Describe morphology of Ethiopian towns and rural homestead patterns.',
        [
          'Compare dispersed vs nucleated rural settlement.',
          'Identify primate city dominance of Addis Ababa.',
          'Discuss informal settlements as national urbanisation challenges.',
        ],
        '<p>Urban topics align with Ethiopian urban policy discourse suitable for Grade 10.</p>'
      ),
      ethUnit(
        'Unit 3: Primary Economic Activities',
        'Ethiopian Grade 10 Geography — agriculture and pastoralism.',
        'Ethiopian farming systems and livestock',
        'Identify major crops and livestock belts.',
        [
          'Describe mixed farming in highlands vs pastoralism in lowlands.',
          'Explain coffee and teff belts qualitatively.',
          'Outline irrigation schemes along Awash and Nile tributaries.',
        ],
        '<p>Economic geography draws from Ethiopian Agricultural Transformation contexts appropriate to secondary level.</p>'
      ),
    ],
  },
  {
    gradeLabel: 'Grade 10',
    stream: 'Social',
    subjectName: 'Economics',
    subjectDescription: 'Ethiopian Grade 10 Economics — production, costs, and market structures (intro).',
    units: [
      ethUnit(
        'Unit 1: Factors of Production',
        'Ethiopian Grade 10 Economics — land, labour, capital, entrepreneurship.',
        'Factor rewards and Ethiopian examples',
        'Identify factor incomes in Ethiopian farms and firms.',
        [
          'Define land, labour, capital, and entrepreneurship.',
          'Classify factor rewards as rent, wages, interest, and profit.',
          'Give Ethiopian illustrations for each factor.',
        ],
        '<p>National curriculum stresses domestic examples over abstract foreign cases.</p>'
      ),
      ethUnit(
        'Unit 2: Production and Costs',
        'Ethiopian Grade 10 Economics — short-run output and cost curves.',
        'Total, average, and marginal cost',
        'Interpret cost tables for small Ethiopian enterprises.',
        [
          'Define fixed vs variable costs.',
          'Calculate average total cost from tables.',
          'Locate minimum average cost intuitively.',
        ],
        '<p>Quantitative depth stays introductory consistent with MoE sequencing before calculus-based optimisation.</p>'
      ),
      ethUnit(
        'Unit 3: Market Structures (Introduction)',
        'Ethiopian Grade 10 Economics — perfect competition vs monopoly basics.',
        'Price determination and market power',
        'Compare competitive grain markets with monopoly utilities.',
        [
          'State assumptions of perfect competition.',
          'Contrast monopoly with competitive outcomes qualitatively.',
          'Recognise consumer surplus reduction under simple monopoly pricing diagrams.',
        ],
        '<p>Ethiopian electricity and telecom contexts illustrate monopoly discussion responsibly at introductory depth.</p>'
      ),
    ],
  },

  // --- Grade 11 (preparatory) ---
  {
    gradeLabel: 'Grade 11',
    stream: 'Natural',
    subjectName: 'Mathematics',
    subjectDescription: 'Ethiopian Grade 11 Mathematics (Natural / preparatory stream).',
    units: [
      ethUnit(
        'Unit 1: Relations and Functions',
        'Ethiopian Grade 11 Mathematics — domain, range, composite functions.',
        'Functions and graphs',
        'Analyse piecewise definitions and composition.',
        [
          'Determine domain and range of real-valued functions.',
          'Form composite functions and identify invertibility for simple cases.',
          'Sketch graphs of polynomial and rational functions at syllabus depth.',
        ],
        '<p>Follows Ethiopian preparatory mathematics treatment before formal limits in Grade 12.</p>'
      ),
      ethUnit(
        'Unit 2: Matrices and Determinants',
        'Ethiopian Grade 11 Mathematics — matrix algebra and Cramer’s rule.',
        'Matrices and systems of linear equations',
        'Solve 2×2 and 3×3 systems where prescribed.',
        [
          'Perform matrix addition, subtraction, and multiplication.',
          'Evaluate determinants for orders two and three.',
          'Apply Cramer’s rule where denominator determinant is non-zero.',
        ],
        '<p>Linear algebra content mirrors national textbook ordering for Natural stream.</p>'
      ),
      ethUnit(
        'Unit 3: Mathematical Induction and Binomial Expansion',
        'Ethiopian Grade 11 Mathematics — proofs and binomial theorem.',
        'Induction and binomial series',
        'Prove summation formulae and expand (a + b)^n for positive integer n.',
        [
          'Construct induction proofs for standard series.',
          'Use binomial coefficients from Pascal’s triangle.',
          'Identify general term in binomial expansion.',
        ],
        '<p>Combinatorial notation stays within MoE preparatory expectations.</p>'
      ),
    ],
  },
  {
    gradeLabel: 'Grade 11',
    stream: 'Natural',
    subjectName: 'Chemistry',
    subjectDescription: 'Ethiopian Grade 11 Chemistry — kinetics, equilibrium, introductory organic.',
    units: [
      ethUnit(
        'Unit 1: Chemical Kinetics',
        'Ethiopian Grade 11 Chemistry — rates and collision theory.',
        'Rate laws and factors affecting rate',
        'Determine order from experimental data where linearisation is taught.',
        [
          'Define rate of reaction and rate constant.',
          'Explain temperature and catalyst effects using collision theory.',
          'Use integrated rate laws for zero and first order as per syllabus.',
        ],
        '<p>Experimental work aligns with Ethiopian lab manuals where schools have facilities.</p>'
      ),
      ethUnit(
        'Unit 2: Chemical Equilibrium',
        'Ethiopian Grade 11 Chemistry — Kc, Kp, and Le Chatelier.',
        'Homogeneous equilibrium calculations',
        'Predict shift direction under constraint changes.',
        [
          'Write equilibrium expressions for homogeneous reactions.',
          'Calculate Kc from equilibrium concentrations.',
          'Apply Le Chatelier’s principle qualitatively and quantitatively at syllabus depth.',
        ],
        '<p>Gaseous equilibria use SI pressures consistent with national exams.</p>'
      ),
      ethUnit(
        'Unit 3: Introduction to Organic Chemistry',
        'Ethiopian Grade 11 Chemistry — hydrocarbons and nomenclature.',
        'Alkanes, alkenes, and alkynes',
        'Name structures using IUPAC rules prescribed nationally.',
        [
          'Identify structural isomerism in hydrocarbons.',
          'Carry out addition reactions of alkenes at introductory level.',
          'Relate fuels used in Ethiopia to hydrocarbon classes.',
        ],
        '<p>Organic chemistry examples reference local fuels without speculative industrial detail.</p>'
      ),
    ],
  },
  {
    gradeLabel: 'Grade 11',
    stream: 'Social',
    subjectName: 'Geography',
    subjectDescription: 'Ethiopian Grade 11 Geography — Africa and Ethiopia in regional context.',
    units: [
      ethUnit(
        'Unit 1: Physical Geography of Africa',
        'Ethiopian Grade 11 Geography — landforms, climate, drainage.',
        'Continental relief and climatic zones',
        'Locate major physical regions relevant to Horn of Africa.',
        [
          'Outline Great Rift Valley and associated lakes.',
          'Compare humid west Africa with Sahelian climates.',
          'Relate relief to river basin boundaries.',
        ],
        '<p>African physical geography is taught before deeper Ethiopian regional synthesis.</p>'
      ),
      ethUnit(
        'Unit 2: Regional Geography of Ethiopia',
        'Ethiopian Grade 11 Geography — administrative regions and resources.',
        'Regional contrasts and development corridors',
        'Describe agricultural and mineral potential by region.',
        [
          'Locate Ethiopian regions and chartered cities.',
          'Explain contrasts between agrarian highlands and pastoral lowlands.',
          'Identify major road corridors linking regions.',
        ],
        '<p>Regional framework follows current Ethiopian administrative geography terminology.</p>'
      ),
      ethUnit(
        'Unit 3: Environmental Issues and Sustainable Development',
        'Ethiopian Grade 11 Geography — degradation and conservation.',
        'Land degradation and watershed management',
        'Link Ethiopian soil erosion to slope and rainfall intensity.',
        [
          'Explain causes of deforestation in Ethiopian highlands.',
          'Outline watershed management programmes.',
          'Discuss sustainable livelihood strategies.',
        ],
        '<p>Environmental content aligns with Ethiopian environmental policy education strands.</p>'
      ),
    ],
  },
  {
    gradeLabel: 'Grade 11',
    stream: 'Social',
    subjectName: 'Economics',
    subjectDescription: 'Ethiopian Grade 11 Economics — national income and development.',
    units: [
      ethUnit(
        'Unit 1: National Income Accounting',
        'Ethiopian Grade 11 Economics — GDP, GNP, NI.',
        'Measuring aggregate output',
        'Distinguish nominal vs real GDP conceptually.',
        [
          'Define GDP using expenditure and income approaches.',
          'Explain omissions from GDP relevant to Ethiopian informal sector discussion.',
          'Interpret simple national accounts tables.',
        ],
        '<p>Uses Ethiopian statistical releases qualitatively appropriate to Grade 11.</p>'
      ),
      ethUnit(
        'Unit 2: Economic Growth and Development',
        'Ethiopian Grade 11 Economics — indicators and structural change.',
        'Development indicators',
        'Compare income per capita with HDI components.',
        [
          'Contrast growth vs development.',
          'Interpret poverty and literacy indicators for Ethiopia.',
          'Outline structural transformation from agriculture to industry.',
        ],
        '<p>Development discourse stays factual and syllabus-grounded.</p>'
      ),
      ethUnit(
        'Unit 3: Ethiopian Agriculture and Rural Policy',
        'Ethiopian Grade 11 Economics — land tenure and productivity.',
        'Rural institutions and productivity constraints',
        'Explain extension services and cooperative roles.',
        [
          'Describe land-use patterns and tenure challenges.',
          'Identify productivity constraints (soil, rainfall, inputs).',
          'Outline national programmes targeting smallholders.',
        ],
        '<p>Policy references remain descriptive for classroom neutrality.</p>'
      ),
    ],
  },

  // --- Grade 12 (preparatory exit / entrance orientation) ---
  {
    gradeLabel: 'Grade 12',
    stream: 'Natural',
    subjectName: 'Physics',
    subjectDescription: 'Ethiopian Grade 12 Physics (Natural stream — electricity, waves, modern physics intro).',
    units: [
      ethUnit(
        'Unit 1: Electrostatics and Capacitors',
        'Ethiopian Grade 12 Physics — Coulomb force and capacitance.',
        'Electric charge and electric field',
        'Compute forces between point charges along a line.',
        [
          'State Coulomb’s law and superposition qualitatively.',
          'Define electric field for point charges.',
          'Explain capacitance and energy stored in capacitors.',
        ],
        '<p>Electrostatics follows Ethiopian preparatory physics sequencing prior to DC circuits.</p>'
      ),
      ethUnit(
        'Unit 2: Direct Current Circuits and Electromagnetic Induction',
        'Ethiopian Grade 12 Physics — Ohm’s law and Faraday’s law basics.',
        'EMF, resistance, and induction',
        'Analyse series and parallel resistor networks.',
        [
          'Apply Ohm’s law to simple circuits.',
          'Calculate equivalent resistance for series and parallel combinations.',
          'State Faraday’s law and Lenz’s law qualitatively.',
        ],
        '<p>Circuit algebra stays within national entrance-exam difficulty bands.</p>'
      ),
      ethUnit(
        'Unit 3: Waves, Optics, and Quantum Phenomena',
        'Ethiopian Grade 12 Physics — wave optics and photoelectric introduction.',
        'Interference and photoelectric effect',
        'Explain Young-type interference conceptually.',
        [
          'Describe interference conditions for constructive and destructive fringes.',
          'Relate photoelectric observations to photon energy.',
          'Compute photon energy using E = hf at syllabus depth.',
        ],
        '<p>Modern physics introduction matches Ethiopian Grade 12 caps without university-level quantum mechanics.</p>'
      ),
    ],
  },
  {
    gradeLabel: 'Grade 12',
    stream: 'Natural',
    subjectName: 'Biology',
    subjectDescription: 'Ethiopian Grade 12 Biology — genetics, evolution, human physiology.',
    units: [
      ethUnit(
        'Unit 1: Molecular Genetics',
        'Ethiopian Grade 12 Biology — DNA structure and protein synthesis.',
        'Replication, transcription, translation',
        'Outline central dogma with Ethiopian agricultural biotechnology examples.',
        [
          'Describe DNA double helix and complementary base pairing.',
          'Outline stages of protein synthesis.',
          'Explain significance of genetic variation for breeding.',
        ],
        '<p>Molecular biology depth follows MoE preparatory standards.</p>'
      ),
      ethUnit(
        'Unit 2: Evolution and Biodiversity',
        'Ethiopian Grade 12 Biology — natural selection and conservation.',
        'Mechanisms of evolution',
        'Apply Darwinian reasoning to Ethiopian endemic species.',
        [
          'Contrast natural selection with genetic drift qualitatively.',
          'Explain adaptive radiation using Ethiopian highland fauna examples.',
          'Outline threats to biodiversity nationally.',
        ],
        '<p>Conservation links to Ethiopian protected areas curriculum strands.</p>'
      ),
      ethUnit(
        'Unit 3: Human Physiology and Homeostasis',
        'Ethiopian Grade 12 Biology — nervous, endocrine, excretion.',
        'Coordination and internal balance',
        'Relate hormone feedback to blood glucose regulation.',
        [
          'Describe neuronal transmission across synapses.',
          'Explain hormonal regulation of metabolism.',
          'Outline kidney roles in osmoregulation.',
        ],
        '<p>Physiology outcomes align with national textbook diagrams and depth.</p>'
      ),
    ],
  },
  {
    gradeLabel: 'Grade 12',
    stream: 'Social',
    subjectName: 'Geography',
    subjectDescription: 'Ethiopian Grade 12 Geography — economic geography, geopolitics, global issues.',
    units: [
      ethUnit(
        'Unit 1: Industrial and Services Geography of Ethiopia',
        'Ethiopian Grade 12 Geography — manufacturing and services location.',
        'Industry, tourism, and infrastructure',
        'Explain industrial clustering around Addis Ababa and regional towns.',
        [
          'Identify major manufacturing branches.',
          'Describe tourism resources (historic sites, national parks).',
          'Map corridor infrastructure linking Ethiopia to ports.',
        ],
        '<p>Economic geography reflects Ethiopian industrial policy vocabulary suitable for exit exams.</p>'
      ),
      ethUnit(
        'Unit 2: Ethiopia and Regional Cooperation',
        'Ethiopian Grade 12 Geography — Horn of Africa integration.',
        'Regional organisations and transboundary resources',
        'Describe IGAD and Nile basin cooperation at introductory level.',
        [
          'Identify objectives of regional economic communities.',
          'Explain transboundary water management challenges.',
          'Assess trade corridors linking Ethiopia to Djibouti.',
        ],
        '<p>Political geography stays factual for classroom use.</p>'
      ),
      ethUnit(
        'Unit 3: Global Environmental Change and Ethiopia',
        'Ethiopian Grade 12 Geography — climate risks and adaptation.',
        'Climate variability and national responses',
        'Link drought cycles to livelihood vulnerability.',
        [
          'Explain ENSO-related rainfall variability in Ethiopia.',
          'Outline adaptation measures in agriculture and water harvesting.',
          'Discuss Ethiopia’s climate commitments at overview level.',
        ],
        '<p>Global change content ties to Ethiopian national adaptation priorities.</p>'
      ),
    ],
  },
  {
    gradeLabel: 'Grade 12',
    stream: 'Social',
    subjectName: 'Economics',
    subjectDescription: 'Ethiopian Grade 12 Economics — money, policy, and international economics.',
    units: [
      ethUnit(
        'Unit 1: Money and Banking in Ethiopia',
        'Ethiopian Grade 12 Economics — functions of money and financial system.',
        'Commercial banking and central banking',
        'Describe roles of National Bank of Ethiopia.',
        [
          'Define functions of money.',
          'Contrast commercial banks from central bank mandates.',
          'Outline monetary policy instruments used nationally.',
        ],
        '<p>Institutional descriptions follow Ethiopian regulatory reality at textbook depth.</p>'
      ),
      ethUnit(
        'Unit 2: Fiscal Policy and Public Finance',
        'Ethiopian Grade 12 Economics — government budget.',
        'Taxation and expenditure',
        'Interpret balanced vs deficit budgets qualitatively.',
        [
          'Classify direct vs indirect taxes with Ethiopian examples.',
          'Explain purposes of government expenditure categories.',
          'Describe crowding out only at conceptual level if syllabus includes.',
        ],
        '<p>Fiscal topics remain descriptive and nationally grounded.</p>'
      ),
      ethUnit(
        'Unit 3: International Trade and Balance of Payments',
        'Ethiopian Grade 12 Economics — comparative advantage and forex.',
        'Exports, imports, and exchange rates',
        'Explain Ethiopia’s major exports and import dependence.',
        [
          'Define comparative advantage using simple two-good models.',
          'Identify components of current account.',
          'Discuss determinants of exchange rate at introductory level.',
        ],
        '<p>Trade structure references coffee and manufactured imports typical in MoE materials.</p>'
      ),
    ],
  },
];

async function seedSubjectWithTree({
  subjectName,
  subjectDescription,
  gradeLevelLabel,
  stream,
  teacherId,
  chapters,
}) {
  const subject = await Subject.create({
    subjectName,
    subjectDescription,
    gradeLevel: gradeLevelLabel,
    stream,
    teacher: teacherId,
  });

  for (const ch of chapters) {
    const chapter = await Chapter.create({
      chapterName: ch.name,
      chapterDescription: ch.description,
      subject: subject._id,
    });
    const topic = await Topic.create({
      topicName: ch.topicName,
      topicDescription: ch.topicDescription,
      topicObjectives: ch.topicObjectives,
      chapter: chapter._id,
    });
    await Concept.create({
      title: ch.topicName,
      content: ch.htmlContent,
      topic: topic._id,
    });
    await Video.create({
      title: ch.topicName,
      videoUrl: ch.videoUrl,
      videoDuration: ch.videoDuration,
      topic: topic._id,
    });
  }

  console.log(`  ✓ ${gradeLevelLabel} · ${stream} · ${subjectName}`);
  return subject;
}

const seedDatabase = async () => {
  try {
    const findOrCreateUser = async (email, userData) => {
      let user = await User.findOne({ email });

      if (!user) {
        user = new User(userData);
        await user.save();
        return user;
      }

      Object.assign(user, userData);
      await user.save();
      return user;
    };

    // 1. Connect to the database
    await connectDB();
    console.log('Database connected successfully.');

    // 2. Clear existing data to prevent duplicates
    console.log('Clearing existing data...');
    // Dependent assessment data (must clear before topics/subjects)
    await Answer.deleteMany({ questionModel: { $in: ['Exercise', 'ExerciseProblem', 'QuizProblem'] } });
    await QuizScore.deleteMany({});
    await QuizProblem.deleteMany({});
    await Quiz.deleteMany({});
    await ExerciseProblem.deleteMany({});
    await Exercise.deleteMany({});
    await Subject.deleteMany({});
    await Chapter.deleteMany({});
    await Topic.deleteMany({});
    await Concept.deleteMany({});
    await Video.deleteMany({});
    // We will not delete users, but find or create them.
    console.log('Data cleared.');

    // 3. Create or find users
    console.log('Creating or finding users...');
    // Default admin
    const admin = await findOrCreateUser(
      'admin@example.com',
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'password123', // The pre-save hook will hash this
        role: 'admin',
        status: 'active',
      }
    );

    // Custom admin for entranceadmin@gmail.com
    const customAdmin = await findOrCreateUser(
      'entranceadmin@gmail.com',
      {
        firstName: 'Entrance',
        lastName: 'Admin',
        email: 'entranceadmin@gmail.com',
        password: '12345Qwert@', // The pre-save hook will hash this
        role: 'admin',
        status: 'active',
      }
    );

    const teacher = await findOrCreateUser(
      'teacher.gebre@example.com',
      {
        firstName: 'Gebre',
        lastName: 'Hagos',
        email: 'teacher.gebre@example.com',
        password: 'password123',
        role: 'teacher',
        status: 'active',
      }
    );

    const student = await findOrCreateUser(
      'dan@gmail.com',
      {
        firstName: 'Dan',
        lastName: 'User',
        email: 'dan@gmail.com',
        password: '12345Qwert@',
        role: 'student',
        status: 'active',
        stream: 'Natural',
        gradeLevel: '12',
      }
    );

    const studentSocial = await findOrCreateUser(
      'social.student@example.com',
      {
        firstName: 'Social',
        lastName: 'Student',
        email: 'social.student@example.com',
        password: '12345Qwert@',
        role: 'student',
        status: 'active',
        stream: 'Social',
        gradeLevel: '12',
      }
    );

    console.log(`Users found or created: ${admin.email}, ${customAdmin.email}, ${teacher.email}, ${student.email}, ${studentSocial.email}`);

    console.log('Creating Ethiopian syllabus-aligned curriculum (2 Natural + 2 Social per grade, 3 units each)...');

    for (const entry of ETHIOPIAN_CURRICULUM_SEED) {
      await seedSubjectWithTree({
        subjectName: entry.subjectName,
        subjectDescription: entry.subjectDescription,
        gradeLevelLabel: entry.gradeLabel,
        stream: entry.stream,
        teacherId: teacher._id,
        chapters: chaptersFromEthUnits(entry.units),
      });
    }

    console.log('Curriculum tree complete (Ethiopian MoE-style units; Geography + Economics each grade).');

    console.log('Creating exercises and quizzes per topic (Ethiopian preparation framing)...');
    await seedEthiopianAssessments(teacher._id);

    try {
      const { connectRedis } = require('../../src/config/redis');
      const appCache = require('../../src/services/appCache');
      await connectRedis().catch(() => {});
      await appCache.invalidateSubjectsCatalog();
      console.log('Subjects catalogue cache invalidated (if Redis is available).');
    } catch (_err) {
      /* ignore cache invalidation failures */
    }

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    // 8. Disconnect from the database
    mongoose.disconnect();
    console.log('Database connection closed.');
  }
};

// Run the seed function
seedDatabase();
