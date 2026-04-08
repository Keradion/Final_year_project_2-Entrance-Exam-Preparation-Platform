const ExamPaper = require('../models/ExamPaper');
const Subject = require('../models/Subject');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errors');

const getRequester = (req) => ({
    id: req.user?.id || req.user?._id?.toString(),
    role: req.user?.role,
});

// @desc    Create exam paper
// @route   POST /api/exams/papers
// @access  Private (Teacher/Admin)
exports.createExamPaper = asyncHandler(async (req, res, next) => {
    const { id: requesterId } = getRequester(req);
    const { subject: subjectId, year, title } = req.body;

    const subject = await Subject.findById(subjectId);
    if (!subject) {
        return next(new ErrorResponse(`Subject not found with id of ${subjectId}`, 404));
    }

    const examPaper = await ExamPaper.create({
        subject: subjectId,
        year,
        title,
        createdBy: requesterId,
    });

    res.status(201).json({
        success: true,
        data: examPaper,
    });
});

// @desc    Get exam papers by subject
// @route   GET /api/exams/papers/subjects/:subjectId
// @access  Public
exports.getExamPapersBySubject = asyncHandler(async (req, res, next) => {
    const { subjectId } = req.params;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const subject = await Subject.findById(subjectId);
    if (!subject) {
        return next(new ErrorResponse(`Subject not found with id of ${subjectId}`, 404));
    }

    const filter = { subject: subjectId };
    const [examPapers, total] = await Promise.all([
      ExamPaper.find(filter).sort({ year: -1, createdAt: -1 }).skip(skip).limit(limit),
      ExamPaper.countDocuments(filter),
    ]);

    res.status(200).json({
        success: true,
        count: examPapers.length,
        total,
        page,
        pages: Math.ceil(total / limit) || 1,
        limit,
        data: examPapers
    });
});

// @desc    Search exam papers
// @route   GET /api/exams/papers/search
// @access  Public
exports.searchExamPapers = asyncHandler(async (req, res, next) => {
    const { year, title, subjectId } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;
    const query = {};

    if (year) {
        query.year = year;
    }

    if (title) {
        query.title = { $regex: title, $options: 'i' };
    }

    if (subjectId) {
        query.subject = subjectId;
    }

    const [examPapers, total] = await Promise.all([
      ExamPaper.find(query).sort({ year: -1, createdAt: -1 }).skip(skip).limit(limit),
      ExamPaper.countDocuments(query),
    ]);

    res.status(200).json({
        success: true,
        count: examPapers.length,
        total,
        page,
        pages: Math.ceil(total / limit) || 1,
        limit,
        data: examPapers
    });
});

// @desc    Update exam paper
// @route   PUT /api/exams/papers/:paperId
// @access  Private (Teacher/Admin)
exports.updateExamPaper = asyncHandler(async (req, res, next) => {
    const { paperId } = req.params;
    const { id: requesterId, role } = getRequester(req);

    const examPaper = await ExamPaper.findById(paperId);
    if (!examPaper) {
        return next(new ErrorResponse(`Exam paper not found with id of ${paperId}`, 404));
    }

    if (role === 'teacher' && examPaper.createdBy?.toString() !== requesterId) {
        return next(new ErrorResponse('Not authorized to update this exam paper', 403));
    }

    if (req.body.subject) {
        const subject = await Subject.findById(req.body.subject);
        if (!subject) {
            return next(new ErrorResponse(`Subject not found with id of ${req.body.subject}`, 404));
        }
    }

    Object.assign(examPaper, req.body);
    await examPaper.save();

    res.status(200).json({
        success: true,
        data: examPaper,
    });
});

// @desc    Delete exam paper
// @route   DELETE /api/exams/papers/:paperId
// @access  Private (Teacher/Admin)
exports.deleteExamPaper = asyncHandler(async (req, res, next) => {
    const { paperId } = req.params;
    const { id: requesterId, role } = getRequester(req);

    const examPaper = await ExamPaper.findById(paperId);
    if (!examPaper) {
        return next(new ErrorResponse(`Exam paper not found with id of ${paperId}`, 404));
    }

    if (role === 'teacher' && examPaper.createdBy?.toString() !== requesterId) {
        return next(new ErrorResponse('Not authorized to delete this exam paper', 403));
    }

    await examPaper.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Exam paper deleted successfully',
    });
});
