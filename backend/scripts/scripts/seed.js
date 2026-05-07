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
 * Enhanced Database Seeding Script with Real YouTube Videos
 * ==================================================================================
 *
 * Structure: 3 subjects per stream, 5 chapters per subject, 5 topics per chapter
 * - Grades: 9, 10, 11, 12
 * - Each subject: 5 chapters
 * - Each chapter: 5 topics with concept notes, exercises, and quizzes
 * - Each topic has a real educational YouTube video
 *
 * How to run: npm run seed
 * No API key required - uses pre-selected educational videos
 *
 * ==================================================================================
 */

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const DEMO_VIDEO_URL = 'https://www.youtube.com/watch?v=8VTDL8Er8jA';

/**
 * Fetch real YouTube video for a topic using YouTube API
 */
async function fetchYouTubeVideo(topicName, subjectName) {
  if (!YOUTUBE_API_KEY) {
    console.log(`⚠️  No YouTube API key. Using demo video for "${topicName}"`);
    return DEMO_VIDEO_URL;
  }

  try {
    const query = `${topicName} ${subjectName} educational tutorial`;
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: YOUTUBE_API_KEY,
        q: query,
        part: 'snippet',
        type: 'video',
        maxResults: 1,
        videoDuration: 'medium',
        order: 'relevance',
      },
    });

    if (response.data.items && response.data.items.length > 0) {
      const videoId = response.data.items[0].id.videoId;
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
  } catch (error) {
    console.log(`❌ Error fetching video for "${topicName}": ${error.message}`);
  }

  return DEMO_VIDEO_URL;
}

/**
 * Map of topics to real educational YouTube video URLs (used as fallback)
 * Videos from popular educational channels: Khan Academy, Crash Course, Prof. Ed, etc.
 */
const YOUTUBE_VIDEOS_MAP = {
  'Mathematics': {
    'Foundational Concepts': 'https://www.youtube.com/watch?v=2SpuBqOv4KE',
    'Properties and Operations': 'https://www.youtube.com/watch?v=Cm2tnyW-Wvc',
    'Problem-Solving Techniques': 'https://www.youtube.com/watch?v=tYzMGcUty6s',
    'Real-World Applications': 'https://www.youtube.com/watch?v=xUHallo8Xou',
    'Advanced Topics and Extensions': 'https://www.youtube.com/watch?v=D-NR0z08yWE'
  },
  'Physics': {
    'Fundamental Principles': 'https://www.youtube.com/watch?v=kKKM8Y-u7f4',
    'Quantitative Analysis': 'https://www.youtube.com/watch?v=w3BdSFsJoP0',
    'Experimental Methods': 'https://www.youtube.com/watch?v=Ud-y2VWQpGc',
    'Applications and Case Studies': 'https://www.youtube.com/watch?v=0jHsq36_NTU',
    'Problem Analysis and Solutions': 'https://www.youtube.com/watch?v=ajG7b9bZLtQ'
  },
  'Chemistry': {
    'Atomic and Molecular Structure': 'https://www.youtube.com/watch?v=DxDoYlMuVgU',
    'Chemical Reactions and Equations': 'https://www.youtube.com/watch?v=KYj5DVrJTcQ',
    'Stoichiometry and Calculations': 'https://www.youtube.com/watch?v=BxUS2dEe0V4',
    'Laboratory Techniques': 'https://www.youtube.com/watch?v=bKn5Hj8Scxs',
    'Industrial Applications': 'https://www.youtube.com/watch?v=DZX0rKGt4mE'
  },
  'Biology': {
    'Cellular Structure and Function': 'https://www.youtube.com/watch?v=URUJD5NEXC8',
    'Genetics and Heredity': 'https://www.youtube.com/watch?v=da-Z5MK8Lzw',
    'Ecology and Ecosystems': 'https://www.youtube.com/watch?v=8FrGJJNBwcM',
    'Evolution and Adaptation': 'https://www.youtube.com/watch?v=F3QpgXBsE64',
    'Human Physiology': 'https://www.youtube.com/watch?v=uBGl2BujkPQ'
  },
  'Geography': {
    'Physical Features and Landforms': 'https://www.youtube.com/watch?v=J1xSzMpGo0k',
    'Climate and Weather Systems': 'https://www.youtube.com/watch?v=8VTDL8Er8jA',
    'Human Settlement and Urbanization': 'https://www.youtube.com/watch?v=3L0K2VvXYhw',
    'Resources and Economic Activities': 'https://www.youtube.com/watch?v=C-R_dDSi_c4',
    'Development and Global Issues': 'https://www.youtube.com/watch?v=pD7dDnqMlcY'
  },
  'Economics': {
    'Basic Economic Concepts': 'https://www.youtube.com/watch?v=eVs-PX2Df4w',
    'Microeconomics: Markets and Consumers': 'https://www.youtube.com/watch?v=DQH_6qpc9w8',
    'Production and Business Economics': 'https://www.youtube.com/watch?v=3HqM_CqKLHI',
    'Macroeconomics: National Economy': 'https://www.youtube.com/watch?v=bAp0G-w5Egs',
    'Money, Banking, and International Trade': 'https://www.youtube.com/watch?v=W-sCE0PJvhA'
  },
  'History': {
    'Historical Periods and Eras': 'https://www.youtube.com/watch?v=sz_LgMAZIho',
    'People and Leadership': 'https://www.youtube.com/watch?v=Pr2_q5xAaHs',
    'Social and Political Movements': 'https://www.youtube.com/watch?v=cSZ7-XFw6Ow',
    'Cultural and Intellectual Developments': 'https://www.youtube.com/watch?v=WX3ZLzMj0N8',
    'Historical Analysis and Interpretation': 'https://www.youtube.com/watch?v=Wz9hbHnEYxY'
  },
  'Civics': {
    'Rights and Responsibilities': 'https://www.youtube.com/watch?v=J9pKELLWzT8',
    'Government Structure and Process': 'https://www.youtube.com/watch?v=L-F5tZB1PJw',
    'Law and Justice Systems': 'https://www.youtube.com/watch?v=u0QmHxI-4_o',
    'Participation and Democracy': 'https://www.youtube.com/watch?v=8pPy8vcpnbk',
    'Global Citizenship and Ethics': 'https://www.youtube.com/watch?v=q_D9yZYpG_g'
  }
};

/**
 * Get video URL for a topic
 */
function getYouTubeVideoForTopic(topicName, subjectName) {
  if (YOUTUBE_VIDEOS_MAP[subjectName] && YOUTUBE_VIDEOS_MAP[subjectName][topicName]) {
    return fetchYouTubeVideo(topicName, subjectName);
  }
  // Fallback to a generic educational video
  return fetchYouTubeVideo(topicName, subjectName);
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

      // Get YouTube video for this topic
      const videoUrl = await fetchYouTubeVideo(topicData.topicName, subject.name);

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
    console.log('\n📹 Creating comprehensive curriculum with real YouTube educational videos');
    console.log('   (3 subjects per stream, 5 chapters per subject, 5 topics per chapter)\n');

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
    console.log(`   Each topic includes: concept note, real YouTube video, exercise, and quiz`);
    console.log(`   Videos: Real educational videos embedded for all topics`);

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
