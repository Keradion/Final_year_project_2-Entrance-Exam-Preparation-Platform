const mongoose = require('mongoose');
const Issue = require('../models/Issue');
const Topic = require('../models/Topic');
const Chapter = require('../models/Chapter');
const Subject = require('../models/Subject');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errors');
const notificationService = require('../services/notificationService');

const allowedTypes = new Set(['bug', 'feature-request', 'error', 'other']);
const allowedStatuses = new Set(['open', 'in-progress', 'resolved', 'closed']);

const getTeacherTopicIds = async (teacherId) => {
  const subjects = await Subject.find({ teacher: teacherId }).select('_id').lean();
  if (subjects.length === 0) {
    return [];
  }

  const subjectIds = subjects.map((subject) => subject._id);
  const chapters = await Chapter.find({ subject: { $in: subjectIds } }).select('_id').lean();
  if (chapters.length === 0) {
    return [];
  }

  const chapterIds = chapters.map((chapter) => chapter._id);
  const topics = await Topic.find({ chapter: { $in: chapterIds } }).select('_id').lean();
  return topics.map((topic) => topic._id);
};

const populateIssueContext = (query) =>
  query
    .populate('studentId', 'firstName lastName email')
    .populate({
      path: 'topicId',
      select: 'topicName chapter',
      populate: {
        path: 'chapter',
        select: 'chapterName subject',
        populate: {
          path: 'subject',
          select: 'subjectName gradeLevel stream teacher',
        },
      },
    });

const populateIssueDocument = (issue) =>
  issue.populate([
    { path: 'studentId', select: 'firstName lastName email' },
    {
      path: 'topicId',
      select: 'topicName chapter',
      populate: {
        path: 'chapter',
        select: 'chapterName subject',
        populate: {
          path: 'subject',
          select: 'subjectName gradeLevel stream teacher',
        },
      },
    },
  ]);

const ensureTeacherCanReviewIssue = async (issue, teacherId) => {
  const topic = await Topic.findById(issue.topicId)
    .select('chapter')
    .populate({
      path: 'chapter',
      select: 'subject',
      populate: {
        path: 'subject',
        select: 'teacher',
      },
    });

  const assignedTeacher = topic?.chapter?.subject?.teacher;
  return assignedTeacher?.toString() === teacherId.toString();
};

// @desc    Submit issue
// @route   POST /api/issues
// @access  Private (Student)
exports.submitIssue = asyncHandler(async (req, res, next) => {
  const { topicId, title, issueDescription, issueType } = req.body;

  const desc = typeof issueDescription === 'string' ? issueDescription.trim() : '';
  if (!topicId || !desc) {
    return next(new ErrorResponse('topicId and issueDescription are required', 400));
  }
  if (!mongoose.Types.ObjectId.isValid(topicId)) {
    return next(new ErrorResponse('Invalid topic id format', 400));
  }
  if (issueType && !allowedTypes.has(issueType)) {
    return next(new ErrorResponse('Invalid issueType', 400));
  }

  const topic = await Topic.findById(topicId).select('topicName').lean();
  if (!topic) {
    return next(new ErrorResponse('Topic not found', 404));
  }

  let resolvedTitle =
    typeof title === 'string' && title.trim() ? title.trim().slice(0, 160) : '';
  if (!resolvedTitle) {
    const firstLine = desc.split(/\r?\n/).find((l) => l.trim()) || desc;
    const snippet = firstLine.trim().slice(0, 80);
    resolvedTitle =
      snippet.length === firstLine.trim().length
        ? snippet
        : `${snippet}${snippet.length >= 80 ? '...' : ''}`;
    if (!resolvedTitle) {
      resolvedTitle = `Topic issue - ${topic.topicName || topicId}`;
    }
  }

  const issue = await Issue.create({
    title: resolvedTitle,
    issueDescription: desc,
    issueType: issueType || 'other',
    studentId: req.user.id,
    topicId,
  });

  await populateIssueDocument(issue);

  res.status(201).json({
    success: true,
    data: issue,
  });
});

// @desc    Get own issues
// @route   GET /api/issues/me
// @access  Private (Student)
exports.getMyIssues = asyncHandler(async (req, res) => {
  const issues = await populateIssueContext(Issue.find({ studentId: req.user.id })).sort({
    created_at: -1,
  });

  res.status(200).json({
    success: true,
    count: issues.length,
    data: issues,
  });
});

// @desc    Get issues for dashboard
// @route   GET /api/issues
// @access  Private (Teacher/Admin)
exports.getIssuesForReview = asyncHandler(async (req, res, next) => {
  const { status, issueType, studentId, topicId } = req.query;
  const filter = {};

  if (status) {
    if (!allowedStatuses.has(status)) {
      return next(new ErrorResponse('Invalid status filter', 400));
    }
    filter.issueStatus = status;
  }
  if (issueType) {
    if (!allowedTypes.has(issueType)) {
      return next(new ErrorResponse('Invalid issueType filter', 400));
    }
    filter.issueType = issueType;
  }
  if (studentId) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return next(new ErrorResponse('Invalid studentId filter', 400));
    }
    filter.studentId = studentId;
  }
  if (topicId) {
    if (!mongoose.Types.ObjectId.isValid(topicId)) {
      return next(new ErrorResponse('Invalid topicId filter', 400));
    }
    filter.topicId = topicId;
  }

  if (req.user.role === 'teacher') {
    const teacherTopicIds = await getTeacherTopicIds(req.user.id);
    if (teacherTopicIds.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    if (filter.topicId && !teacherTopicIds.some((id) => id.toString() === filter.topicId)) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    filter.topicId = filter.topicId || { $in: teacherTopicIds };
  }

  const issues = await populateIssueContext(Issue.find(filter)).sort({ created_at: -1 });

  res.status(200).json({
    success: true,
    count: issues.length,
    data: issues,
  });
});

// @desc    Update issue status / response
// @route   PUT /api/issues/:issueId/status
// @access  Private (Teacher/Admin)
exports.updateIssueStatus = asyncHandler(async (req, res, next) => {
  const { issueId } = req.params;
  const { issueStatus, response } = req.body;

  if (!mongoose.Types.ObjectId.isValid(issueId)) {
    return next(new ErrorResponse('Invalid issue id format', 400));
  }
  if (!issueStatus || !allowedStatuses.has(issueStatus)) {
    return next(new ErrorResponse('Valid issueStatus is required', 400));
  }

  const issue = await Issue.findById(issueId);
  if (!issue) {
    return next(new ErrorResponse('Issue not found', 404));
  }

  if (req.user.role === 'teacher') {
    const canReview = await ensureTeacherCanReviewIssue(issue, req.user.id);
    if (!canReview) {
      return next(new ErrorResponse('You can only review issues for subjects assigned to you', 403));
    }
  }

  const previousStatus = issue.issueStatus;
  const previousResponse = issue.response || '';
  issue.issueStatus = issueStatus;
  if (typeof response === 'string') {
    issue.response = response.trim();
  }
  await issue.save();
  await populateIssueDocument(issue);

  const statusChanged = previousStatus !== issue.issueStatus;
  const responseChanged = previousResponse !== (issue.response || '');
  if (statusChanged || responseChanged) {
    const topicName = issue.topicId?.topicName || 'your topic';
    const reviewer = req.user.role === 'admin' ? 'administrator' : 'teacher';
    const outcome =
      issue.response ||
      `Your reported issue is now marked as ${issue.issueStatus.replace('-', ' ')}.`;

    await notificationService.sendNotification(
      issue.studentId._id || issue.studentId,
      `Issue update for ${topicName}`,
      `A ${reviewer} reviewed your reported issue. ${outcome}`
    );
  }

  res.status(200).json({
    success: true,
    data: issue,
  });
});

