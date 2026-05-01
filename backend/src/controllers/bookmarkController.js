const mongoose = require('mongoose');
const Bookmark = require('../models/Bookmark');
const { Topic, Concept, Video, Exercise, Quiz, ExamQuestion } = require('../models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errors');

const allowedResourceTypes = new Set(['topic', 'video', 'concept', 'exercise', 'quiz', 'exercise-question', 'exam-question']);

const summarizeText = (value, fallback) => {
  if (!value) return fallback;
  return value.length > 90 ? `${value.slice(0, 87)}...` : value;
};

const buildBookmarkTarget = async (bookmark) => {
  const base = bookmark.toObject ? bookmark.toObject() : bookmark;
  const id = base.resourceId;
  const fallback = {
    title: base.resourceType.replace('-', ' '),
    targetPath: '',
  };

  if (base.resourceType === 'topic') {
    const topic = await Topic.findById(id).select('topicName').lean();
    return { ...base, title: topic?.topicName || fallback.title, targetPath: `/curriculum/topic/${id}/objectives` };
  }

  if (base.resourceType === 'concept') {
    const concept = await Concept.findById(id).select('title topic').lean();
    return { ...base, title: concept?.title || 'Concept note', targetPath: concept?.topic ? `/curriculum/topic/${concept.topic}/concept` : '' };
  }

  if (base.resourceType === 'video') {
    const video = await Video.findById(id).select('title topic').lean();
    return { ...base, title: video?.title || 'Video resource', targetPath: video?.topic ? `/curriculum/topic/${video.topic}/video` : '' };
  }

  if (base.resourceType === 'exercise' || base.resourceType === 'exercise-question') {
    const exercise = await Exercise.findById(id).select('title question topic').lean();
    return {
      ...base,
      title: summarizeText(exercise?.question, exercise?.title || 'Exercise question'),
      targetPath: exercise?.topic ? `/curriculum/topic/${exercise.topic}/exercise` : '',
    };
  }

  if (base.resourceType === 'quiz') {
    const quiz = await Quiz.findById(id).select('title topic').lean();
    return { ...base, title: quiz?.title || 'Quiz', targetPath: quiz?.topic ? `/curriculum/topic/${quiz.topic}/quiz` : '' };
  }

  if (base.resourceType === 'exam-question') {
    const question = await ExamQuestion.findById(id).select('questionText topic examPaper').populate('examPaper', 'year title').lean();
    const year = question?.examPaper?.year ? ` (${question.examPaper.year})` : '';
    return {
      ...base,
      title: `${summarizeText(question?.questionText, 'Previous year question')}${year}`,
      targetPath: question?.topic ? `/curriculum/topic/${question.topic}/exam` : '',
    };
  }

  return { ...base, ...fallback };
};

// @desc    Add bookmark
// @route   POST /api/bookmarks
// @access  Private (Student)
exports.addBookmark = asyncHandler(async (req, res, next) => {
  const { resourceType, resourceId, note = '' } = req.body;
  const studentId = req.user.id;

  if (!allowedResourceTypes.has(resourceType)) {
    return next(new ErrorResponse('Invalid resourceType', 400));
  }

  if (!mongoose.Types.ObjectId.isValid(resourceId)) {
    return next(new ErrorResponse('Invalid resourceId format', 400));
  }

  const bookmark = await Bookmark.findOneAndUpdate(
    { studentId, resourceType, resourceId },
    {
      $set: { note: String(note || '').trim() },
      $setOnInsert: { studentId, resourceType, resourceId },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  res.status(201).json({
    success: true,
    data: await buildBookmarkTarget(bookmark),
  });
});

// @desc    Remove bookmark
// @route   DELETE /api/bookmarks/:bookmarkId
// @access  Private (Student)
exports.removeBookmark = asyncHandler(async (req, res, next) => {
  const { bookmarkId } = req.params;
  const studentId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(bookmarkId)) {
    return next(new ErrorResponse('Invalid bookmark id format', 400));
  }

  const deleted = await Bookmark.findOneAndDelete({ _id: bookmarkId, studentId });
  if (!deleted) {
    return next(new ErrorResponse('Bookmark not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Bookmark removed successfully',
  });
});

// @desc    Get all bookmarks for current student
// @route   GET /api/bookmarks
// @access  Private (Student)
exports.getBookmarks = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const bookmarks = await Bookmark.find({ studentId }).sort({ created_at: -1 });
  const enrichedBookmarks = await Promise.all(bookmarks.map(buildBookmarkTarget));

  res.status(200).json({
    success: true,
    count: bookmarks.length,
    data: enrichedBookmarks,
  });
});

