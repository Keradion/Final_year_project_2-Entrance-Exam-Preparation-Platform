const mongoose = require('mongoose');
const Question = require('../models/Question');
const QuestionAnswer = require('../models/QuestionAnswer');
const Topic = require('../models/Topic');
const Chapter = require('../models/Chapter');
const Subject = require('../models/Subject');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errors');
const notificationService = require('../services/notificationService');

const ensureTeacherOwnsQuestionSubject = async (question, teacherId) => {
  const topic = await Topic.findById(question.topicId).select('chapter').lean();
  const chapter = topic?.chapter ? await Chapter.findById(topic.chapter).select('subject').lean() : null;
  const subject = chapter?.subject ? await Subject.findById(chapter.subject).select('teacher').lean() : null;
  return subject?.teacher?.toString() === teacherId;
};

const getQuestionTopicName = async (question) => {
  const topic = await Topic.findById(question.topicId).select('topicName').lean();
  return topic?.topicName || 'your topic';
};

// @desc    Answer a student question
// @route   POST /api/questions/:questionId/answers
// @access  Private (Teacher)
exports.answerQuestion = asyncHandler(async (req, res, next) => {
  const { questionId } = req.params;
  const { answerText } = req.body;

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return next(new ErrorResponse('Invalid question id format', 400));
  }
  if (!answerText) {
    return next(new ErrorResponse('answerText is required', 400));
  }

  const question = await Question.findById(questionId);
  if (!question) {
    return next(new ErrorResponse('Question not found', 404));
  }
  const canAnswer = await ensureTeacherOwnsQuestionSubject(question, req.user.id);
  if (!canAnswer) {
    return next(new ErrorResponse('You can only answer questions for subjects assigned to you', 403));
  }

  const existingAnswerCount = await QuestionAnswer.countDocuments({ questionId });
  const answer = await QuestionAnswer.create({
    questionId,
    teacherId: req.user.id,
    answerText,
  });

  if (existingAnswerCount === 0 && question.status !== 'answered') {
    question.status = 'answered';
    question.answeredAt = new Date();
    question.answeredBy = req.user.id;
    await question.save();
  }

  const topicName = await getQuestionTopicName(question);
  await notificationService.sendNotification(
    question.studentId,
    'Your question was answered',
    `A teacher answered your question under ${topicName}.`
  );

  res.status(201).json({
    success: true,
    data: answer,
  });
});

// @desc    Update own answer
// @route   PUT /api/questions/:questionId/answers/:answerId
// @access  Private (Teacher)
exports.updateAnswer = asyncHandler(async (req, res, next) => {
  const { answerId } = req.params;
  const { answerText } = req.body;
  if (!mongoose.Types.ObjectId.isValid(answerId)) {
    return next(new ErrorResponse('Invalid answer id format', 400));
  }
  if (!answerText) {
    return next(new ErrorResponse('answerText is required', 400));
  }

  const answer = await QuestionAnswer.findById(answerId);
  if (!answer) {
    return next(new ErrorResponse('Answer not found', 404));
  }
  if (answer.teacherId.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this answer', 403));
  }

  answer.answerText = answerText;
  await answer.save();

  res.status(200).json({
    success: true,
    data: answer,
  });
});

// @desc    Delete own answer
// @route   DELETE /api/questions/:questionId/answers/:answerId
// @access  Private (Teacher)
exports.deleteAnswer = asyncHandler(async (req, res, next) => {
  const { answerId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(answerId)) {
    return next(new ErrorResponse('Invalid answer id format', 400));
  }

  const answer = await QuestionAnswer.findById(answerId);
  if (!answer) {
    return next(new ErrorResponse('Answer not found', 404));
  }
  if (answer.teacherId.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this answer', 403));
  }

  await answer.deleteOne();

  const remainingAnswerCount = await QuestionAnswer.countDocuments({ questionId: answer.questionId });
  if (remainingAnswerCount === 0) {
    await Question.findByIdAndUpdate(answer.questionId, {
      status: 'open',
      answeredAt: null,
      answeredBy: null,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Answer deleted successfully',
  });
});

// @desc    Get answers for a question
// @route   GET /api/questions/:questionId/answers
// @access  Private (Student/Teacher/Admin)
exports.getAnswersForQuestion = asyncHandler(async (req, res, next) => {
  const { questionId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return next(new ErrorResponse('Invalid question id format', 400));
  }

  const answers = await QuestionAnswer.find({ questionId })
    .populate('teacherId', 'firstName lastName role')
    .sort({ created_at: 1 });

  res.status(200).json({
    success: true,
    count: answers.length,
    data: answers,
  });
});

