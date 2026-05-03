const mongoose = require('mongoose');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errors');
const {
  getAllSubjectProgress,
  getGradeProgress,
  getStudentLearningStreak,
  getStudentResultsSummary,
  getSubjectProgress,
  getSubjectChapterProgress,
  getTopicQuizCompletionStatus,
  markTopicCompleted,
} = require('../services/progressService');
const appCache = require('../services/appCache');

const userIdStr = (u) => (typeof u === 'string' ? u : String(u));

exports.getMySubjectProgress = asyncHandler(async (req, res) => {
  const uid = userIdStr(req.user.id);
  const progress = await appCache.readThrough(
    appCache.progressAllSubjectsKey(uid),
    appCache.TTL_PROGRESS,
    () => getAllSubjectProgress(uid)
  );

  res.status(200).json({
    success: true,
    count: progress.length,
    data: progress,
  });
});

exports.getMyResultsSummary = asyncHandler(async (req, res) => {
  const uid = userIdStr(req.user.id);
  const stream = req.user.stream;
  const gradeLevel = req.query.gradeLevel;
  const results = await appCache.readThrough(
    appCache.progressResultsKey(uid, gradeLevel, stream),
    appCache.TTL_PROGRESS,
    () =>
      getStudentResultsSummary(uid, {
        gradeLevel,
        stream,
      })
  );

  res.status(200).json({
    success: true,
    data: results,
  });
});

exports.getMyLearningStreak = asyncHandler(async (req, res) => {
  const uid = userIdStr(req.user.id);
  const stream = req.user.stream;
  const gradeLevel = req.query.gradeLevel;
  const streak = await appCache.readThrough(
    appCache.progressStreakKey(uid, gradeLevel, stream),
    appCache.TTL_PROGRESS,
    () =>
      getStudentLearningStreak(uid, {
        gradeLevel,
        stream,
      })
  );

  res.status(200).json({
    success: true,
    data: streak,
  });
});

exports.getMyProgressForSubject = asyncHandler(async (req, res, next) => {
  const { subjectId } = req.params;
  const uid = userIdStr(req.user.id);

  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    return next(new ErrorResponse('Invalid subjectId format', 400));
  }

  const progress = await appCache.readThrough(
    appCache.progressSubjectKey(uid, subjectId),
    appCache.TTL_PROGRESS,
    () => getSubjectProgress(uid, subjectId)
  );

  res.status(200).json({
    success: true,
    data: progress,
  });
});

exports.getMyChapterProgressForSubject = asyncHandler(async (req, res, next) => {
  const { subjectId } = req.params;
  const uid = userIdStr(req.user.id);

  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    return next(new ErrorResponse('Invalid subjectId format', 400));
  }

  const progress = await appCache.readThrough(
    appCache.progressChaptersKey(uid, subjectId),
    appCache.TTL_PROGRESS,
    () => getSubjectChapterProgress(uid, subjectId)
  );

  res.status(200).json({
    success: true,
    data: progress,
  });
});

exports.getMyGradeProgress = asyncHandler(async (req, res) => {
  const { gradeLevel } = req.params;
  const uid = userIdStr(req.user.id);
  const stream = req.user.stream;
  const progress = await appCache.readThrough(
    appCache.progressGradeKey(uid, gradeLevel, stream),
    appCache.TTL_PROGRESS,
    () => getGradeProgress(uid, gradeLevel, stream)
  );

  res.status(200).json({
    success: true,
    data: progress,
  });
});

exports.getTopicCompletionEligibility = asyncHandler(async (req, res, next) => {
  const { topicId } = req.params;
  const uid = userIdStr(req.user.id);

  if (!mongoose.Types.ObjectId.isValid(topicId)) {
    return next(new ErrorResponse('Invalid topicId format', 400));
  }

  const quizCompletion = await appCache.readThrough(
    appCache.progressEligibilityKey(uid, topicId),
    appCache.TTL_PROGRESS,
    () => getTopicQuizCompletionStatus(uid, topicId)
  );

  res.status(200).json({
    success: true,
    data: quizCompletion,
  });
});

exports.completeTopic = asyncHandler(async (req, res, next) => {
  const { topicId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(topicId)) {
    return next(new ErrorResponse('Invalid topicId format', 400));
  }

  const result = await markTopicCompleted(req.user.id, topicId);
  if (!result) {
    return next(new ErrorResponse('Topic or subject not found', 404));
  }
  if (!result.progress && result.quizCompletion) {
    return next(new ErrorResponse(result.quizCompletion.message, 400));
  }

  await appCache.invalidateUserProgress(userIdStr(req.user.id));

  res.status(200).json({
    success: true,
    data: result.progress,
    quizCompletion: result.quizCompletion,
    newlyReachedMilestones: result.newlyReachedMilestones || [],
  });
});
