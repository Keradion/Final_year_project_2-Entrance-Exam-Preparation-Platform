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

const { GRADE_9_NATURAL_CURRICULUM, pickVideoUrl } = require('./data/grade9NaturalCurriculum');
const { getTopicPayload } = require('./data/grade9TopicPayloads');

/**
 * Grade 9 Natural — real topic payloads (articles, objectives, exercises, quizzes).
 *   npm run seed:populate
 */

async function seedExercisesFromPayload(topic, subjectDoc, teacherId, payload) {
  const list =
    Array.isArray(payload.exercises) && payload.exercises.length > 0
      ? payload.exercises
      : payload.exercise
        ? [payload.exercise]
        : [];
  let i = 0;
  for (const ex of list) {
    await Exercise.create({
      topic: topic._id,
      title: list.length > 1 ? `Practice ${i + 1}: ${topic.topicName}` : `Practice: ${topic.topicName}`,
      description: payload.objectives[0],
      question: ex.question,
      options: ex.options,
      correctAnswer: ex.correctAnswer,
      hint: ex.hint,
      difficulty: 'Medium',
      createdBy: teacherId,
    });
    i += 1;
  }
}

async function seedQuizFromPayload(topic, subjectDoc, chapter, teacherId, payload) {
  const quiz = await Quiz.create({
    topic: topic._id,
    title: `Check: ${topic.topicName}`,
    description: `"${topic.topicName}" · ${chapter.chapterName} (${subjectDoc.subjectName})`,
    duration: 15,
    createdBy: teacherId,
  });

  for (const item of payload.quizItems) {
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
      const payload = getTopicPayload(entry.name, chapterSpec.chapterName, topicName);

      const topic = await Topic.create({
        topicName,
        topicDescription: payload.objectives.join(' '),
        topicObjectives: payload.objectives,
        chapter: chapter._id,
      });

      await Concept.create({
        title: topicName,
        content: payload.article,
        topic: topic._id,
      });

      const videoUrl = payload.videoUrl || pickVideoUrl(entry.name, videoIndex);
      await Video.create({
        title: `${topicName} — video support`,
        videoUrl,
        videoDuration: 600 + (videoIndex % 8) * 120,
        topic: topic._id,
      });
      videoIndex += 1;

      await seedExercisesFromPayload(topic, subjectDoc, teacherId, payload);
      await seedQuizFromPayload(topic, subjectDoc, chapter, teacherId, payload);
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

    console.log('\nSeeding Grade 9 Natural stream (real topic payloads)...');

    const gradeLabel = 'Grade 9';
    const stream = 'Natural';
    let videoCursor = 0;
    let totalTopics = 0;

    for (const entry of GRADE_9_NATURAL_CURRICULUM) {
      const topics = entry.plan.reduce((n, ch) => n + ch.topics.length, 0);
      totalTopics += topics;
      console.log(`  → ${entry.name}: ${entry.plan.length} units, ${topics} topics`);
      const { nextVideoOffset } = await seedSubjectFromGrade9Plan(entry, gradeLabel, stream, teacher._id, videoCursor);
      videoCursor = nextVideoOffset;
    }

    console.log(`\n✅ Seed complete: ${GRADE_9_NATURAL_CURRICULUM.length} subjects, ${totalTopics} topics.`);

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
