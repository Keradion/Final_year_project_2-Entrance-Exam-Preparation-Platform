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

exports.getMySubjectProgress = asyncHandler(async (req, res) => {
  const progress = await getAllSubjectProgress(req.user.id);

  res.status(200).json({
    success: true,
    count: progress.length,
    data: progress,
  });
});

exports.getMyResultsSummary = asyncHandler(async (req, res) => {
  const results = await getStudentResultsSummary(req.user.id, {
    gradeLevel: req.query.gradeLevel,
    stream: req.user.stream,
  });

  res.status(200).json({
    success: true,
    data: results,
  });
});

exports.getMyLearningStreak = asyncHandler(async (req, res) => {
  const streak = await getStudentLearningStreak(req.user.id, {
    gradeLevel: req.query.gradeLevel,
    stream: req.user.stream,
  });

  res.status(200).json({
    success: true,
    data: streak,
  });
});

exports.getMyProgressForSubject = asyncHandler(async (req, res, next) => {
  const { subjectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    return next(new ErrorResponse('Invalid subjectId format', 400));
  }

  const progress = await getSubjectProgress(req.user.id, subjectId);

  res.status(200).json({
    success: true,
    data: progress,
  });
});

exports.getMyChapterProgressForSubject = asyncHandler(async (req, res, next) => {
  const { subjectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    return next(new ErrorResponse('Invalid subjectId format', 400));
  }

  const progress = await getSubjectChapterProgress(req.user.id, subjectId);

  res.status(200).json({
    success: true,
    data: progress,
  });
});

exports.getMyGradeProgress = asyncHandler(async (req, res) => {
  const { gradeLevel } = req.params;
  const progress = await getGradeProgress(req.user.id, gradeLevel, req.user.stream);

  res.status(200).json({
    success: true,
    data: progress,
  });
});

exports.getTopicCompletionEligibility = asyncHandler(async (req, res, next) => {
  const { topicId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(topicId)) {
    return next(new ErrorResponse('Invalid topicId format', 400));
  }

  const quizCompletion = await getTopicQuizCompletionStatus(req.user.id, topicId);

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

  res.status(200).json({
    success: true,
    data: result.progress,
    quizCompletion: result.quizCompletion,
    newlyReachedMilestones: result.newlyReachedMilestones || [],
  });
});
