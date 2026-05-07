require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { connectDB } = require('../../src/config/database');
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
 * Enhanced Database Seeding Script
 * ==================================================================================
 *
 * Structure:
 * - Grades: 9, 10, 11, 12
 * - Each grade: 3 Natural subjects + 3 Social subjects
 * - Each subject: 5 chapters
 * - Each chapter: 5 topics
 * - Each topic: concept notes, video, exercise, quiz
 *
 * How to run:
 * npm run seed
 *
 * ==================================================================================
 */
const DEMO_VIDEO_URL = 'https://www.youtube.com/watch?v=IwW0GJWKH98';

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
 * Generate topics for a chapter
 */
function generateTopicsForChapter(subjectName, chapterName) {
  const topicTemplates = {
    'Mathematics': [
      { name: 'Foundational Concepts', desc: 'Core definitions and basic principles of the chapter', objs: ['Understand fundamental definitions', 'Recognize basic principles', 'Apply core concepts'] },
      { name: 'Properties and Operations', desc: 'Key properties and how to perform operations', objs: ['Identify mathematical properties', 'Perform operations correctly', 'Verify results'] },
      { name: 'Problem-Solving Techniques', desc: 'Methods and strategies for solving problems systematically', objs: ['Select appropriate techniques', 'Solve standard problems', 'Justify solutions'] },
      { name: 'Real-World Applications', desc: 'Practical applications in everyday contexts', objs: ['Recognize applications', 'Model real situations', 'Interpret results'] },
      { name: 'Advanced Topics and Extensions', desc: 'Extended concepts and deeper understanding', objs: ['Extend foundational knowledge', 'Explore connections', 'Solve complex problems'] }
    ],
    'Physics': [
      { name: 'Fundamental Principles', desc: 'Basic laws and fundamental concepts governing the topic', objs: ['State fundamental laws', 'Explain basic principles', 'Apply laws to situations'] },
      { name: 'Quantitative Analysis', desc: 'Mathematical treatment and calculations', objs: ['Set up equations', 'Calculate values accurately', 'Analyze results'] },
      { name: 'Experimental Methods', desc: 'Laboratory techniques and measurement procedures', objs: ['Design experiments', 'Collect data accurately', 'Analyze measurements'] },
      { name: 'Applications and Case Studies', desc: 'Real-world scenarios and practical examples', objs: ['Apply concepts to scenarios', 'Analyze case studies', 'Evaluate outcomes'] },
      { name: 'Problem Analysis and Solutions', desc: 'Complex multistep problem-solving', objs: ['Analyze multistep problems', 'Develop solutions', 'Check validity'] }
    ],
    'Chemistry': [
      { name: 'Atomic and Molecular Structure', desc: 'Structure and composition of matter', objs: ['Describe atomic structure', 'Explain molecular arrangement', 'Draw structures'] },
      { name: 'Chemical Reactions and Equations', desc: 'Reaction types and proper representations', objs: ['Write balanced equations', 'Classify reaction types', 'Predict products'] },
      { name: 'Stoichiometry and Calculations', desc: 'Quantitative relationships in chemistry', objs: ['Calculate quantities', 'Solve stoichiometric problems', 'Interpret ratios'] },
      { name: 'Laboratory Techniques', desc: 'Experimental procedures and safety protocols', objs: ['Perform procedures safely', 'Interpret experimental results', 'Document observations'] },
      { name: 'Industrial and Practical Applications', desc: 'Real-world chemistry in industry and life', objs: ['Apply to real situations', 'Understand industrial processes', 'Evaluate sustainability'] }
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
    ]
  };

  const templates = topicTemplates[subjectName] || topicTemplates['Mathematics'];
  return templates.map((t, idx) => ({
    topicName: `${t.name}`,
    topicDescription: t.desc,
    topicObjectives: t.objs,
    htmlContent: generateConceptContent(t.name, t.desc, t.objs),
    videoUrl: DEMO_VIDEO_URL,
    videoDuration: 600 + (idx * 90),
  }));
}

/**
 * Generate topics-focused exercises
 */
async function seedExercises(topic, subject, chapter, teacherId) {
  const subjectName = subject.subjectName;
  const topicName = topic.topicName;
  
  const exercise = await Exercise.create({
    topic: topic._id,
    title: `Practice: ${topicName}`,
    description: `Apply your understanding of ${topicName} from ${chapter.chapterName} (${subjectName}).`,
    question: `Based on ${topicName}, select the correct statement:\n\n${topicName} is fundamental to understanding ${subjectName}.`,
    options: [
      `This is a direct application of ${topicName} from the lesson.`,
      `This topic is not related to ${topicName}.`,
      `${topicName} is only theoretical without practical value.`,
      `Advanced concepts beyond ${topicName} scope.`,
    ],
    correctAnswer: 0,
    hint: `Review the learning objectives for ${topicName}.`,
    difficulty: 'Medium',
    createdBy: teacherId,
  });

  return exercise;
}

/**
 * Generate topics-focused quizzes
 */
async function seedQuizzes(topic, subject, chapter, teacherId) {
  const subjectName = subject.subjectName;
  const topicName = topic.topicName;
  
  const quiz = await Quiz.create({
    topic: topic._id,
    title: `Check: ${topicName}`,
    description: `Quick assessment of ${topicName} concepts in ${chapter.chapterName}.`,
    duration: 15,
    createdBy: teacherId,
  });

  const quizItems = [
    {
      questionText: `What is the primary focus of the topic "${topicName}"?`,
      choices: [
        { text: `Understanding ${topicName}`, value: 'A' },
        { text: `Advanced mathematics unrelated to this topic`, value: 'B' },
        { text: `General knowledge about other subjects`, value: 'C' },
        { text: `Memorizing definitions without context`, value: 'D' },
      ],
      correctAnswer: 'A',
      answerExplanation: `The topic directly addresses ${topicName}. Review the lesson objectives to master this material.`,
    },
    {
      questionText: `Which learning objective is directly aligned with ${topicName}?`,
      choices: [
        { text: `Apply concepts and solve problems related to ${topicName}`, value: 'A' },
        { text: `Learn unrelated historical facts`, value: 'B' },
        { text: `Study advanced topics beyond this level`, value: 'C' },
        { text: `Memorize without understanding`, value: 'D' },
      ],
      correctAnswer: 'A',
      answerExplanation: `Learning objectives for ${topicName} focus on understanding and application, not rote memorization.`,
    },
    {
      questionText: `How does ${topicName} connect to real-world applications?`,
      choices: [
        { text: `It provides practical tools for solving problems in ${subjectName}`, value: 'A' },
        { text: `It has no practical value`, value: 'B' },
        { text: `It is purely theoretical`, value: 'C' },
        { text: `It is unrelated to everyday situations`, value: 'D' },
      ],
      correctAnswer: 'A',
      answerExplanation: `${topicName} applies directly to real problems. Understanding these applications helps master the concept.`,
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

  return quiz;
}

/**
 * Define curriculum structure: 3 subjects per stream, per grade
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
 * Chapter names for all subjects
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

  for (let chapterIdx = 0; chapterIdx < CHAPTER_NAMES.length; chapterIdx++) {
    const chapterName = CHAPTER_NAMES[chapterIdx];
    const chapter = await Chapter.create({
      chapterName,
      chapterDescription: `${chapterName} of ${subject.name} - comprehensive coverage of core topics and applications.`,
      subject: subjectDoc._id,
    });

    const topics = generateTopicsForChapter(subject.name, chapterName);
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

      await Video.create({
        title: topicData.topicName,
        videoUrl: topicData.videoUrl,
        videoDuration: topicData.videoDuration,
        topic: topic._id,
      });

      await seedExercises(topic, subjectDoc, chapter, teacherId);
      await seedQuizzes(topic, subjectDoc, chapter, teacherId);
    }
  }

  console.log(`  ✓ ${gradeLabel} · ${stream} · ${subject.name}`);
  return subjectDoc;
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

    console.log('Creating comprehensive curriculum (3 subjects per stream, 5 chapters per subject, 5 topics per chapter)...');

    let subjectCount = 0;
    for (const gradeLabel of ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']) {
      console.log(`\n${gradeLabel}:`);

      for (const stream of ['Natural', 'Social']) {
        const subjects = CURRICULUM_STRUCTURE[gradeLabel][stream];
        console.log(`  ${stream} Stream:`);
        for (const subject of subjects) {
          await seedSubject(subject, gradeLabel, stream, teacher._id);
          subjectCount++;
        }
      }
    }

    console.log(`\n✅ Curriculum complete: ${subjectCount} subjects with 5 chapters and 5 topics each`);
    console.log('Total content: 600 topics with concept notes, exercises, and quizzes');

    try {
      const { connectRedis } = require('../../src/config/redis');
      const appCache = require('../../src/services/appCache');
      await connectRedis().catch(() => {});
      await appCache.invalidateSubjectsCatalog();
      console.log('Subject catalogue cache invalidated.');
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
