require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { connectDB } = require('../../src/config/database');
const {
  Answer,
  QuizScore,
  QuizProblem,
  Quiz,
  ExerciseProblem,
  Exercise,
  Video,
  Concept,
  ExamQuestion,
  ExamPaper,
  Progress,
  SubjectProgress,
  Question,
  QuestionAnswer,
  Issue,
  Bookmark,
  Topic,
  Chapter,
  Subject,
} = require('../../src/models');

/**
 * Purges all curriculum and learner-facing content tied to subjects/topics.
 * Does not create demo users or re-seed data. Run: npm run seed
 */
async function purgeCurriculum() {
  await connectDB();
  console.log('Database connected. Purging curriculum and related data...');

  const results = await Promise.all([
    Answer.deleteMany({}),
    QuizScore.deleteMany({}),
    QuizProblem.deleteMany({}),
    Quiz.deleteMany({}),
    ExerciseProblem.deleteMany({}),
    Exercise.deleteMany({}),
    Video.deleteMany({}),
    Concept.deleteMany({}),
    ExamQuestion.deleteMany({}),
    ExamPaper.deleteMany({}),
    Progress.deleteMany({}),
    SubjectProgress.deleteMany({}),
    QuestionAnswer.deleteMany({}),
    Question.deleteMany({}),
    Issue.deleteMany({}),
    Bookmark.deleteMany({}),
    Topic.deleteMany({}),
    Chapter.deleteMany({}),
    Subject.deleteMany({}),
  ]);

  const total = results.reduce((n, r) => n + (r.deletedCount || 0), 0);
  console.log(`Removed ${total} documents across curriculum collections.`);

  try {
    const { connectRedis } = require('../../src/config/redis');
    const appCache = require('../../src/services/appCache');
    await connectRedis().catch(() => {});
    await appCache.invalidateSubjectsCatalog();
    console.log('Subject catalogue cache invalidated.');
  } catch (_err) {
    // Redis optional
  }

  console.log('Purge complete. No subjects or chapters remain.');
}

purgeCurriculum()
  .catch((err) => {
    console.error('Purge failed:', err);
    process.exit(1);
  })
  .finally(() => {
    mongoose.disconnect().then(() => console.log('Database connection closed.'));
  });
