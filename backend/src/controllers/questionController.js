const mongoose = require('mongoose');
const Question = require('../models/Question');
const QuestionAnswer = require('../models/QuestionAnswer');
const Topic = require('../models/Topic');
const Chapter = require('../models/Chapter');
const Subject = require('../models/Subject');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errors');
const notificationService = require('../services/notificationService');

const getTeacherTopicIds = async (teacherId) => {
  const subjects = await Subject.find({ teacher: teacherId }).select('_id').lean();
  if (subjects.length === 0) return [];

  const chapters = await Chapter.find({ subject: { $in: subjects.map((subject) => subject._id) } }).select('_id').lean();
  if (chapters.length === 0) return [];

  const topics = await Topic.find({ chapter: { $in: chapters.map((chapter) => chapter._id) } }).select('_id').lean();
  return topics.map((topic) => topic._id);
};

// @desc    Ask a question under a topic
// @route   POST /api/questions
// @access  Private (Student)
exports.askQuestion = asyncHandler(async (req, res, next) => {
  const { topicId, questionText } = req.body;
  if (!topicId || !questionText) {
    return next(new ErrorResponse('topicId and questionText are required', 400));
  }
  if (!mongoose.Types.ObjectId.isValid(topicId)) {
    return next(new ErrorResponse('Invalid topicId format', 400));
  }

  const topic = await Topic.findById(topicId);
  if (!topic) {
    return next(new ErrorResponse('Topic not found', 404));
  }

  const question = await Question.create({
    topicId,
    questionText,
    studentId: req.user.id,
  });

  const chapter = topic.chapter ? await Chapter.findById(topic.chapter).select('subject').lean() : null;
  const subject = chapter?.subject ? await Subject.findById(chapter.subject).select('subjectName teacher').lean() : null;
  if (subject?.teacher) {
    await notificationService.sendNotification(
      subject.teacher,
      'New student question',
      `A student asked a question under ${topic.topicName} in ${subject.subjectName}.`
    );
  }

  res.status(201).json({
    success: true,
    data: question,
  });
});

// @desc    Update own question
// @route   PUT /api/questions/:questionId
// @access  Private (Student)
exports.updateQuestion = asyncHandler(async (req, res, next) => {
  const { questionId } = req.params;
  const { questionText } = req.body;

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return next(new ErrorResponse('Invalid question id format', 400));
  }
  if (!questionText) {
    return next(new ErrorResponse('questionText is required', 400));
  }

  const question = await Question.findById(questionId);
  if (!question) {
    return next(new ErrorResponse('Question not found', 404));
  }
  if (question.studentId.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this question', 403));
  }

  question.questionText = questionText;
  await question.save();

  res.status(200).json({
    success: true,
    data: question,
  });
});

// @desc    Delete own question and its answers
// @route   DELETE /api/questions/:questionId
// @access  Private (Student)
exports.deleteQuestion = asyncHandler(async (req, res, next) => {
  const { questionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return next(new ErrorResponse('Invalid question id format', 400));
  }

  const question = await Question.findById(questionId);
  if (!question) {
    return next(new ErrorResponse('Question not found', 404));
  }
  if (question.studentId.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this question', 403));
  }

  await Promise.all([
    QuestionAnswer.deleteMany({ questionId }),
    question.deleteOne(),
  ]);

  res.status(200).json({
    success: true,
    message: 'Question deleted successfully',
  });
});

// @desc    Get topic questions
// @route   GET /api/questions/topics/:topicId
// @access  Private (Student/Teacher/Admin)
exports.getTopicQuestions = asyncHandler(async (req, res, next) => {
  const { topicId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(topicId)) {
    return next(new ErrorResponse('Invalid topic id format', 400));
  }

  const questions = await Question.find({ topicId })
    .populate('studentId', 'firstName lastName')
    .sort({ created_at: -1 });

  res.status(200).json({
    success: true,
    count: questions.length,
    data: questions,
  });
});

// @desc    Search questions by text
// @route   GET /api/questions/search?q=...
// @access  Private (Student/Teacher/Admin)
exports.searchQuestions = asyncHandler(async (req, res, next) => {
  const { q } = req.query;
  if (!q) {
    return next(new ErrorResponse('Search query q is required', 400));
  }

  const questions = await Question.find({
    $text: { $search: q },
  })
    .populate('studentId', 'firstName lastName')
    .sort({ score: { $meta: 'textScore' }, created_at: -1 });

  res.status(200).json({
    success: true,
    count: questions.length,
    data: questions,
  });
});

// @desc    Get one question details
// @route   GET /api/questions/:questionId
// @access  Private (Student/Teacher/Admin)
exports.getQuestionById = asyncHandler(async (req, res, next) => {
  const { questionId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return next(new ErrorResponse('Invalid question id format', 400));
  }

  const question = await Question.findById(questionId).populate('studentId', 'firstName lastName');
  if (!question) {
    return next(new ErrorResponse('Question not found', 404));
  }

  // Basic engagement update for FR-16 browsing
  question.views = (question.views || 0) + 1;
  await question.save();

  res.status(200).json({
    success: true,
    data: question,
  });
});

// @desc    List questions (dashboard/feed)
// @route   GET /api/questions
// @access  Private (Student/Teacher/Admin)
exports.listQuestions = asyncHandler(async (req, res, next) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
  const skip = (page - 1) * limit;
  const { topicId, studentId, q } = req.query;

  const filter = {};
  if (topicId) {
    if (!mongoose.Types.ObjectId.isValid(topicId)) {
      return next(new ErrorResponse('Invalid topicId filter', 400));
    }
    filter.topicId = topicId;
  }
  if (studentId) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return next(new ErrorResponse('Invalid studentId filter', 400));
    }
    filter.studentId = studentId;
  }
  if (q) {
    filter.questionText = { $regex: q, $options: 'i' };
  }

  if (req.user.role === 'teacher') {
    const teacherTopicIds = await getTeacherTopicIds(req.user.id);
    if (teacherTopicIds.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        total: 0,
        page,
        pages: 1,
        data: [],
      });
    }

    if (filter.topicId && !teacherTopicIds.some((id) => id.toString() === filter.topicId)) {
      return res.status(200).json({
        success: true,
        count: 0,
        total: 0,
        page,
        pages: 1,
        data: [],
      });
    }

    filter.topicId = filter.topicId || { $in: teacherTopicIds };
  }

  const [questions, total] = await Promise.all([
    Question.find(filter)
      .populate('studentId', 'firstName lastName')
      .populate('topicId', 'topicName')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit),
    Question.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: questions.length,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    data: questions,
  });
});

