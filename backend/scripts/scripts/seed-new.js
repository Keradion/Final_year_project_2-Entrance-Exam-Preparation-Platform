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

const {
  GRADE_9_NATURAL_CURRICULUM,
  learningObjectivesForTopic,
  buildConceptArticle,
  pickVideoUrl,
} = require('./data/grade9NaturalCurriculum');

/**
 * Grade 9 Natural stream only — MoE-style units/sections, plain-text concept articles,
 * objectives-aligned exercises and quizzes, rotating curated YouTube URLs.
 *
 * Populate DB (clears curriculum first):
 *   npm run seed:populate
 */

async function seedExerciseAligned(topic, subjectDoc, chapter, teacherId, objectives) {
  const topicName = topic.topicName;
  const subjectName = subjectDoc.subjectName;
  const chapterName = chapter.chapterName;

  await Exercise.create({
    topic: topic._id,
    title: `Practice: ${topicName}`,
    description: objectives[0],
    question: `You are revising "${topicName}" (${chapterName}, ${subjectName}). Which approach best matches your official learning objectives for this section?\n\nChoose the option that shows real understanding and correct use of the content.`,
    options: [
      `Explain the main ideas of ${topicName} in my own words, work textbook examples step by step, then apply the same reasoning to a new question.`,
      `Skim ${topicName} once and move on without practicing calculations or definitions.`,
      `Memorize phrases about ${topicName} without knowing when they apply.`,
      `Assume ${topicName} will not appear on assessments and skip all practice.`,
    ],
    correctAnswer: 0,
    hint: `Reread the three objectives for ${topicName}. The correct approach should let you meet every objective, not only one of them.`,
    difficulty: 'Medium',
    createdBy: teacherId,
  });
}

async function seedQuizAligned(topic, subjectDoc, chapter, teacherId, objectives) {
  const topicName = topic.topicName;
  const subjectName = subjectDoc.subjectName;
  const chapterName = chapter.chapterName;

  const quiz = await Quiz.create({
    topic: topic._id,
    title: `Check: ${topicName}`,
    description: `Short check on "${topicName}" in ${chapterName} (${subjectName}).`,
    duration: 15,
    createdBy: teacherId,
  });

  const obj1 = objectives[0];
  const obj2 = objectives[1];
  const obj3 = objectives[2];

  const quizItems = [
    {
      questionText: `According to the learning objectives, what is the first thing you should be able to do after studying "${topicName}"?`,
      choices: [
        { text: obj1, value: 'A' },
        { text: `Ignore the definitions in ${topicName} and still score full marks.`, value: 'B' },
        { text: `Study unrelated historical facts instead of ${topicName}.`, value: 'C' },
        { text: `Replace ${topicName} with content from a different subject.`, value: 'D' },
      ],
      correctAnswer: 'A',
      answerExplanation: `The first objective focuses on explaining and relating ${topicName} to its chapter context.`,
    },
    {
      questionText: `Which activity best shows you have mastered the second objective for "${topicName}"?`,
      choices: [
        { text: obj2, value: 'A' },
        { text: `Copy answers from a key without showing any reasoning.`, value: 'B' },
        { text: `Skip all practice problems for ${topicName}.`, value: 'C' },
        { text: `Avoid any use of procedures taught in ${topicName}.`, value: 'D' },
      ],
      correctAnswer: 'A',
      answerExplanation: `The second objective expects you to use definitions and procedures on typical Grade 9 tasks.`,
    },
    {
      questionText: `The third objective for "${topicName}" stresses checking work and connecting to official examples. Which behavior fits that goal?`,
      choices: [
        { text: obj3, value: 'A' },
        { text: `Never compare my work with textbook solutions.`, value: 'B' },
        { text: `Finish quickly without reading problem conditions.`, value: 'C' },
        { text: `Assume every answer is correct if it looks short.`, value: 'D' },
      ],
      correctAnswer: 'A',
      answerExplanation: `The third objective asks you to verify results and connect ${topicName} to textbook examples.`,
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
 * Seed one subject from GRADE_9_NATURAL_CURRICULUM entry.
 */
async function seedSubjectFromGrade9Plan(entry, gradeLabel, stream, teacherId, subjectVideoOffset) {
  const subjectDoc = await Subject.create({
    subjectName: entry.name,
    subjectDescription: entry.desc,
    gradeLevel: gradeLabel,
    stream,
    teacher: teacherId,
  });

  let videoIndex = subjectVideoOffset;

  for (const chapterSpec of entry.plan) {
    const chapter = await Chapter.create({
      chapterName: chapterSpec.chapterName,
      chapterDescription: `${chapterSpec.chapterName} — ${entry.name}, ${gradeLabel} (${stream} stream).`,
      subject: subjectDoc._id,
    });

    for (const topicName of chapterSpec.topics) {
      const objectives = learningObjectivesForTopic(entry.name, chapterSpec.chapterName, topicName);
      const article = buildConceptArticle({
        subjectName: entry.name,
        chapterName: chapterSpec.chapterName,
        topicName,
        objectives,
      });

      const topic = await Topic.create({
        topicName,
        topicDescription: objectives.join(' '),
        topicObjectives: objectives,
        chapter: chapter._id,
      });

      await Concept.create({
        title: topicName,
        content: article,
        topic: topic._id,
      });

      await Video.create({
        title: `${topicName} — video support`,
        videoUrl: pickVideoUrl(entry.name, videoIndex),
        videoDuration: 600 + (videoIndex % 8) * 120,
        topic: topic._id,
      });
      videoIndex += 1;

      await seedExerciseAligned(topic, subjectDoc, chapter, teacherId, objectives);
      await seedQuizAligned(topic, subjectDoc, chapter, teacherId, objectives);
    }
  }

  console.log(`  ✓ ${gradeLabel} · ${stream} · ${entry.name}`);
  return { subjectDoc, nextVideoOffset: videoIndex };
}

async function seedDatabase() {
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

    console.log('Clearing curriculum and dependent learner data...');
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
    console.log('Curriculum collections cleared.');

    console.log('Creating or finding users...');
    await findOrCreateUser('admin@example.com', {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      status: 'active',
    });

    await findOrCreateUser('entranceadmin@gmail.com', {
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

    await findOrCreateUser('dan@gmail.com', {
      firstName: 'Dan',
      lastName: 'User',
      email: 'dan@gmail.com',
      password: '12345Qwert@',
      role: 'student',
      status: 'active',
      stream: 'Natural',
      gradeLevel: '9',
    });

    await findOrCreateUser('social.student@example.com', {
      firstName: 'Social',
      lastName: 'Student',
      email: 'social.student@example.com',
      password: '12345Qwert@',
      role: 'student',
      status: 'active',
      stream: 'Social',
      gradeLevel: '9',
    });

    console.log('Users created/found successfully.');

    console.log('\nSeeding Grade 9 Natural stream only (Mathematics, Physics, Chemistry, Biology)...');

    const gradeLabel = 'Grade 9';
    const stream = 'Natural';
    let videoCursor = 0;
    let totalTopics = 0;

    for (const entry of GRADE_9_NATURAL_CURRICULUM) {
      const chapters = entry.plan.length;
      const topics = entry.plan.reduce((n, ch) => n + ch.topics.length, 0);
      totalTopics += topics;
      console.log(`  → ${entry.name}: ${chapters} units, ${topics} topics`);
      const { nextVideoOffset } = await seedSubjectFromGrade9Plan(entry, gradeLabel, stream, teacher._id, videoCursor);
      videoCursor = nextVideoOffset;
    }

    console.log(`\n✅ Seed complete: ${GRADE_9_NATURAL_CURRICULUM.length} subjects, ${totalTopics} topics (concepts are plain-text articles).`);

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
}

seedDatabase();
