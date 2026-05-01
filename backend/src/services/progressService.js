const mongoose = require('mongoose');
const {
  Answer,
  Chapter,
  ExamQuestion,
  Exercise,
  ExerciseProblem,
  Progress,
  Quiz,
  QuizProblem,
  Subject,
  SubjectProgress,
  Topic,
} = require('../models');
const notificationService = require('./notificationService');
const { calculateProgress, getMilestones } = require('../utils/helpers');

const getSubjectForTopic = async (topicId) => {
  const topic = await Topic.findById(topicId).select('chapter topicName').lean();
  if (!topic?.chapter) return null;

  const chapter = await Chapter.findById(topic.chapter).select('subject').lean();
  if (!chapter?.subject) return null;

  const subject = await Subject.findById(chapter.subject).select('subjectName').lean();
  if (!subject) return null;

  return { topic, subject };
};

const getSubjectTopicIds = async (subjectId) => {
  const chapters = await Chapter.find({ subject: subjectId }).select('_id').lean();
  const chapterIds = chapters.map((chapter) => chapter._id);
  if (chapterIds.length === 0) return [];

  const topics = await Topic.find({ chapter: { $in: chapterIds } }).select('_id').lean();
  return topics.map((topic) => topic._id);
};

const getTopicQuizCompletionStatus = async (studentId, topicId) => {
  const quizzes = await Quiz.find({ topic: topicId }).select('_id').lean();
  const quizIds = quizzes.map((quiz) => quiz._id);

  if (quizIds.length === 0) {
    return {
      eligible: false,
      totalQuestions: 0,
      answeredQuestions: 0,
      remainingQuestions: 0,
      message: 'This topic does not have quiz questions yet, so completion cannot be marked.',
    };
  }

  const problemIds = await QuizProblem.distinct('_id', { quizId: { $in: quizIds } });
  const totalQuestions = problemIds.length;

  if (totalQuestions === 0) {
    return {
      eligible: false,
      totalQuestions: 0,
      answeredQuestions: 0,
      remainingQuestions: 0,
      message: 'This topic does not have quiz questions yet, so completion cannot be marked.',
    };
  }

  const answeredProblemIds = await Answer.distinct('question', {
    student: studentId,
    questionModel: 'QuizProblem',
    question: { $in: problemIds },
  });
  const answeredQuestions = answeredProblemIds.length;
  const remainingQuestions = Math.max(totalQuestions - answeredQuestions, 0);

  return {
    eligible: remainingQuestions === 0,
    totalQuestions,
    answeredQuestions,
    remainingQuestions,
    message: remainingQuestions === 0
      ? 'All quiz questions for this topic are answered.'
      : `Answer ${remainingQuestions} more quiz question${remainingQuestions === 1 ? '' : 's'} before marking this topic complete.`,
  };
};

const getCompletedTopicIdSet = async (studentId, topicIds) => {
  if (!topicIds.length) return new Set();

  const completedTopicIds = await Progress.distinct('topicId', {
    studentId,
    topicId: { $in: topicIds },
    status: 'completed',
  });

  return new Set(completedTopicIds.map((id) => id.toString()));
};

const buildSubjectProgress = async (studentId, subjectId) => {
  const topicIds = await getSubjectTopicIds(subjectId);
  const totalTopics = topicIds.length;
  const completedTopicIds = totalTopics
    ? await Progress.distinct('topicId', {
        studentId,
        topicId: { $in: topicIds },
        status: 'completed',
      })
    : [];
  const completedTopics = completedTopicIds.length;
  const completionPercentage = calculateProgress(completedTopics, totalTopics);
  const status = completionPercentage >= 100
    ? 'completed'
    : completionPercentage > 0
      ? 'in-progress'
      : 'not-started';

  return { completionPercentage, completedTopics, totalTopics, status };
};

const refreshSubjectProgress = async (studentId, subjectId) => {
  const summary = await buildSubjectProgress(studentId, subjectId);
  const existing = await SubjectProgress.findOne({ studentId, subjectId });
  const milestonesNotified = existing?.milestonesNotified || [];
  const reachedMilestones = getMilestones(summary.completionPercentage);
  const newlyReachedMilestones = reachedMilestones.filter((milestone) => !milestonesNotified.includes(milestone));

  const progress = await SubjectProgress.findOneAndUpdate(
    { studentId, subjectId },
    {
      $set: {
        ...summary,
        lastUpdatedAt: new Date(),
      },
      $addToSet: { milestonesNotified: { $each: newlyReachedMilestones } },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).populate('subjectId', 'subjectName gradeLevel');

  if (newlyReachedMilestones.length > 0) {
    const subjectName = progress.subjectId?.subjectName || 'your subject';
    await Promise.all(newlyReachedMilestones.map((milestone) =>
      notificationService.sendNotification(
        studentId,
        `${milestone}% milestone reached`,
        `Great work! You reached ${milestone}% completion in ${subjectName}.`
      )
    ));
  }

  return { progress, newlyReachedMilestones };
};

const markTopicCompleted = async (studentId, topicId) => {
  const resolved = await getSubjectForTopic(topicId);
  if (!resolved) return null;

  const quizCompletion = await getTopicQuizCompletionStatus(studentId, topicId);
  if (!quizCompletion.eligible) {
    return { progress: null, quizCompletion };
  }

  await Progress.findOneAndUpdate(
    { studentId, topicId },
    {
      completionPercentage: 100,
      status: 'completed',
      lastAccessedDate: new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return {
    ...await refreshSubjectProgress(studentId, resolved.subject._id),
    quizCompletion,
  };
};

const getSubjectProgress = async (studentId, subjectId) => {
  const { progress } = await refreshSubjectProgress(studentId, subjectId);
  return progress;
};

const getAllSubjectProgress = async (studentId) => {
  const subjects = await Subject.find().select('_id').lean();
  const results = await Promise.all(subjects.map((subject) => getSubjectProgress(studentId, subject._id)));
  return results.filter(Boolean);
};

const getSubjectChapterProgress = async (studentId, subjectId) => {
  const subjectProgress = await getSubjectProgress(studentId, subjectId);
  const chapters = await Chapter.find({ subject: subjectId }).sort({ createdAt: 1 }).select('_id chapterName subject').lean();
  const chapterIds = chapters.map((chapter) => chapter._id);
  const topics = chapterIds.length
    ? await Topic.find({ chapter: { $in: chapterIds } }).sort({ createdAt: 1 }).select('_id topicName chapter').lean()
    : [];
  const completedTopicIds = await getCompletedTopicIdSet(studentId, topics.map((topic) => topic._id));

  const chapterProgress = chapters.map((chapter) => {
    const chapterTopics = topics.filter((topic) => topic.chapter.toString() === chapter._id.toString());
    const completedTopics = chapterTopics.filter((topic) => completedTopicIds.has(topic._id.toString())).length;
    const completionPercentage = calculateProgress(completedTopics, chapterTopics.length);

    return {
      chapterId: chapter._id,
      chapterName: chapter.chapterName,
      completionPercentage,
      completedTopics,
      totalTopics: chapterTopics.length,
      status: completionPercentage >= 100 ? 'completed' : completionPercentage > 0 ? 'in-progress' : 'not-started',
      topics: chapterTopics.map((topic) => ({
        topicId: topic._id,
        topicName: topic.topicName,
        completed: completedTopicIds.has(topic._id.toString()),
      })),
    };
  });

  return {
    subjectProgress,
    chapters: chapterProgress,
  };
};

const getGradeProgress = async (studentId, gradeLevel, stream) => {
  const query = stream
    ? { gradeLevel, $or: [{ stream: { $exists: false } }, { stream: null }, { stream: '' }, { stream }] }
    : { gradeLevel };
  const subjects = await Subject.find(query).select('_id subjectName gradeLevel stream').lean();
  const subjectSummaries = await Promise.all(subjects.map(async (subject) => {
    const progress = await getSubjectProgress(studentId, subject._id);
    return {
      subjectId: subject._id,
      subjectName: subject.subjectName,
      gradeLevel: subject.gradeLevel,
      stream: subject.stream,
      completionPercentage: progress?.completionPercentage || 0,
      completedTopics: progress?.completedTopics || 0,
      totalTopics: progress?.totalTopics || 0,
      status: progress?.status || 'not-started',
    };
  }));

  const completedTopics = subjectSummaries.reduce((sum, item) => sum + item.completedTopics, 0);
  const totalTopics = subjectSummaries.reduce((sum, item) => sum + item.totalTopics, 0);

  return {
    gradeLevel,
    completionPercentage: calculateProgress(completedTopics, totalTopics),
    completedTopics,
    totalTopics,
    subjects: subjectSummaries,
  };
};

const buildEmptyResultsSummary = () => ({
  attempted: 0,
  correct: 0,
  accuracy: 0,
  byType: {
    Exercises: { attempted: 0, correct: 0, accuracy: 0 },
    Quizzes: { attempted: 0, correct: 0, accuracy: 0 },
    Exams: { attempted: 0, correct: 0, accuracy: 0 },
  },
});

const getGradeTopicIds = async (gradeLevel, stream) => {
  if (!gradeLevel) return null;

  const query = stream
    ? { gradeLevel, $or: [{ stream: { $exists: false } }, { stream: null }, { stream: '' }, { stream }] }
    : { gradeLevel };
  const subjects = await Subject.find(query).select('_id').lean();
  const subjectIds = subjects.map((subject) => subject._id);
  if (subjectIds.length === 0) return [];

  const chapters = await Chapter.find({ subject: { $in: subjectIds } }).select('_id').lean();
  const chapterIds = chapters.map((chapter) => chapter._id);
  if (chapterIds.length === 0) return [];

  return Topic.distinct('_id', { chapter: { $in: chapterIds } });
};

const getScopedQuestionFilters = async (gradeLevel, stream) => {
  const topicIds = await getGradeTopicIds(gradeLevel, stream);
  if (!topicIds) return null;
  if (topicIds.length === 0) return [];

  const [exercises, quizzes, examQuestions] = await Promise.all([
    Exercise.find({ topic: { $in: topicIds } }).select('_id').lean(),
    Quiz.find({ topic: { $in: topicIds } }).select('_id').lean(),
    ExamQuestion.find({ topic: { $in: topicIds } }).select('_id').lean(),
  ]);

  const exerciseIds = exercises.map((exercise) => exercise._id);
  const quizIds = quizzes.map((quiz) => quiz._id);
  const [exerciseProblemIds, quizProblemIds] = await Promise.all([
    exerciseIds.length ? ExerciseProblem.distinct('_id', { exerciseId: { $in: exerciseIds } }) : [],
    quizIds.length ? QuizProblem.distinct('_id', { quizId: { $in: quizIds } }) : [],
  ]);

  return [
    { questionModel: 'Exercise', question: { $in: exerciseIds } },
    { questionModel: 'ExerciseProblem', question: { $in: exerciseProblemIds } },
    { questionModel: 'QuizProblem', question: { $in: quizProblemIds } },
    { questionModel: 'ExamQuestion', question: { $in: examQuestions.map((question) => question._id) } },
  ].filter((filter) => filter.question.$in.length > 0);
};

const getStudentResultsSummary = async (studentId, { gradeLevel, stream } = {}) => {
  const summary = buildEmptyResultsSummary();
  const scopedQuestionFilters = await getScopedQuestionFilters(gradeLevel, stream);
  if (scopedQuestionFilters && scopedQuestionFilters.length === 0) {
    return summary;
  }

  const match = {
    student: new mongoose.Types.ObjectId(studentId),
    ...(scopedQuestionFilters ? { $or: scopedQuestionFilters } : {}),
  };

  const results = await Answer.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$questionModel',
        attempted: { $sum: 1 },
        correct: { $sum: { $cond: ['$isCorrect', 1, 0] } },
      },
    },
  ]);

  const labels = {
    ExerciseProblem: 'Exercises',
    Exercise: 'Exercises',
    QuizProblem: 'Quizzes',
    ExamQuestion: 'Exams',
  };

  results.forEach((item) => {
    const label = labels[item._id];
    if (!label) return;

    summary.attempted += item.attempted;
    summary.correct += item.correct;
    summary.byType[label].attempted += item.attempted;
    summary.byType[label].correct += item.correct;
  });

  summary.accuracy = calculateProgress(summary.correct, summary.attempted);
  Object.keys(summary.byType).forEach((key) => {
    const item = summary.byType[key];
    item.accuracy = calculateProgress(item.correct, item.attempted);
  });

  return summary;
};

const toDateKey = (date) => new Date(date).toISOString().slice(0, 10);

const countCurrentStreak = (dateKeys) => {
  if (dateKeys.length === 0) return 0;

  let streak = 1;
  let cursor = new Date(`${dateKeys[dateKeys.length - 1]}T00:00:00.000Z`);

  for (let index = dateKeys.length - 2; index >= 0; index -= 1) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (dateKeys[index] !== toDateKey(cursor)) break;
    streak += 1;
  }

  return streak;
};

const countLongestStreak = (dateKeys) => {
  if (dateKeys.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let index = 1; index < dateKeys.length; index += 1) {
    const previous = new Date(`${dateKeys[index - 1]}T00:00:00.000Z`);
    previous.setUTCDate(previous.getUTCDate() + 1);

    if (dateKeys[index] === toDateKey(previous)) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
};

const getStudentLearningStreak = async (studentId, { gradeLevel, stream } = {}) => {
  const scopedQuestionFilters = await getScopedQuestionFilters(gradeLevel, stream);
  const topicIds = await getGradeTopicIds(gradeLevel, stream);

  if (topicIds && topicIds.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      activeDays: 0,
      lastActiveDate: null,
      gradeLevel: gradeLevel || null,
    };
  }

  const answerMatch = {
    student: new mongoose.Types.ObjectId(studentId),
    ...(scopedQuestionFilters ? { $or: scopedQuestionFilters } : {}),
  };
  const progressMatch = {
    studentId,
    ...(topicIds ? { topicId: { $in: topicIds } } : {}),
  };

  const [answers, progressEntries] = await Promise.all([
    scopedQuestionFilters && scopedQuestionFilters.length === 0
      ? []
      : Answer.find(answerMatch).select('createdAt').lean(),
    Progress.find(progressMatch).select('lastAccessedDate updatedAt createdAt').lean(),
  ]);

  const activityDates = new Set();
  answers.forEach((answer) => {
    if (answer.createdAt) activityDates.add(toDateKey(answer.createdAt));
  });
  progressEntries.forEach((entry) => {
    const date = entry.lastAccessedDate || entry.updatedAt || entry.createdAt;
    if (date) activityDates.add(toDateKey(date));
  });

  const dateKeys = Array.from(activityDates).sort();

  return {
    currentStreak: countCurrentStreak(dateKeys),
    longestStreak: countLongestStreak(dateKeys),
    activeDays: dateKeys.length,
    lastActiveDate: dateKeys[dateKeys.length - 1] || null,
    gradeLevel: gradeLevel || null,
  };
};

module.exports = {
  getAllSubjectProgress,
  getGradeProgress,
  getStudentLearningStreak,
  getStudentResultsSummary,
  getSubjectProgress,
  getSubjectChapterProgress,
  getTopicQuizCompletionStatus,
  markTopicCompleted,
};
