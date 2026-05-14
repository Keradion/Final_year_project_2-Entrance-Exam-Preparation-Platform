const ExamQuestion = require('../models/ExamQuestion');
const ExamPaper = require('../models/ExamPaper');
const Topic = require('../models/Topic');
const Answer = require('../models/Answer');
const mongoose = require('mongoose');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errors');
const appCache = require('../services/appCache');
const {
  normalizeExamQuestionStem,
  sanitizeExamPaperDoc,
} = require('../utils/examQuestionStem');

const getRequester = (req) => ({
    id: req.user?.id || req.user?._id?.toString(),
    role: req.user?.role,
});

// @desc    Add question to an exam paper
// @route   POST /api/exams/papers/:paperId/questions
// @access  Private (Teacher/Admin)
exports.addExamQuestion = asyncHandler(async (req, res, next) => {
    const { paperId } = req.params;
    const { id: requesterId, role } = getRequester(req);

    const paper = await ExamPaper.findById(paperId);
    if (!paper) {
        return next(new ErrorResponse(`Exam paper not found with id of ${paperId}`, 404));
    }

    if (role === 'teacher' && paper.createdBy?.toString() !== requesterId) {
        return next(new ErrorResponse('Not authorized to add questions to this paper', 403));
    }

    const topic = await Topic.findById(req.body.topic);
    if (!topic) {
        return next(new ErrorResponse(`Topic not found with id of ${req.body.topic}`, 404));
    }

    const question = await ExamQuestion.create({
        ...req.body,
        examPaper: paperId,
    });

    res.status(201).json({
        success: true,
        data: question,
    });
});

// @desc    Get exam questions by paper
// @route   GET /api/exams/papers/:paperId/questions
// @access  Public
exports.getExamQuestionsByPaper = asyncHandler(async (req, res, next) => {
    const { paperId } = req.params;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 200);
    const skip = (page - 1) * limit;

    const paper = await ExamPaper.findById(paperId);
    if (!paper) {
        return next(new ErrorResponse(`Exam paper not found with id of ${paperId}`, 404));
    }

    const filter = { examPaper: paperId };
    const [questions, total] = await Promise.all([
      ExamQuestion.find(filter).sort({ createdAt: 1 }).skip(skip).limit(limit).lean(),
      ExamQuestion.countDocuments(filter),
    ]);

    const data = questions.map((q) => ({
      ...q,
      questionText: normalizeExamQuestionStem(q.questionText),
    }));

    res.status(200).json({
        success: true,
        count: data.length,
        total,
        page,
        pages: Math.ceil(total / limit) || 1,
        limit,
        data,
    });
});

// @desc    Search exam questions with filters
// @route   GET /api/exams/questions/search
// @access  Public
exports.searchExamQuestions = asyncHandler(async (req, res, next) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 200);
    const skip = (page - 1) * limit;

    const { subjectId, chapterId, topicId, year, q } = req.query;

    const pipeline = [
        {
            $lookup: {
                from: 'exampapers',
                localField: 'examPaper',
                foreignField: '_id',
                as: 'examPaperDoc',
            },
        },
        { $unwind: '$examPaperDoc' },
        {
            $lookup: {
                from: 'topics',
                localField: 'topic',
                foreignField: '_id',
                as: 'topicDoc',
            },
        },
        { $unwind: '$topicDoc' },
    ];

    const match = {};

    if (subjectId) {
        if (!mongoose.Types.ObjectId.isValid(subjectId)) {
            return next(new ErrorResponse('Invalid subjectId format', 400));
        }
        match['examPaperDoc.subject'] = new mongoose.Types.ObjectId(subjectId);
    }

    if (chapterId) {
        if (!mongoose.Types.ObjectId.isValid(chapterId)) {
            return next(new ErrorResponse('Invalid chapterId format', 400));
        }
        match['topicDoc.chapter'] = new mongoose.Types.ObjectId(chapterId);
    }

    if (topicId) {
        if (!mongoose.Types.ObjectId.isValid(topicId)) {
            return next(new ErrorResponse('Invalid topicId format', 400));
        }
        match.topic = new mongoose.Types.ObjectId(topicId);
    }

    if (year) {
        match['examPaperDoc.year'] = Number(year);
    }

    if (q) {
        match.questionText = { $regex: q, $options: 'i' };
    }

    if (Object.keys(match).length > 0) {
        pipeline.push({ $match: match });
    }

    pipeline.push(
        { $sort: { createdAt: -1 } },
        {
            $facet: {
                data: [{ $skip: skip }, { $limit: limit }],
                meta: [{ $count: 'total' }],
            },
        }
    );

    const result = await ExamQuestion.aggregate(pipeline);
    const rows = result[0]?.data || [];
    const total = result[0]?.meta?.[0]?.total || 0;

    const data = rows.map((row) => ({
      ...row,
      questionText: normalizeExamQuestionStem(row.questionText),
      examPaperDoc: sanitizeExamPaperDoc(row.examPaperDoc),
    }));

    res.status(200).json({
        success: true,
        count: data.length,
        total,
        page,
        pages: Math.ceil(total / limit) || 1,
        limit,
        data,
    });
});

// @desc    Update exam question
// @route   PUT /api/exams/questions/:questionId
// @access  Private (Teacher/Admin)
exports.updateExamQuestion = asyncHandler(async (req, res, next) => {
    const { questionId } = req.params;
    const { id: requesterId, role } = getRequester(req);

    const question = await ExamQuestion.findById(questionId);
    if (!question) {
        return next(new ErrorResponse(`Exam question not found with id of ${questionId}`, 404));
    }

    const paper = await ExamPaper.findById(question.examPaper);
    if (!paper) {
        return next(new ErrorResponse('Parent exam paper not found', 404));
    }

    if (role === 'teacher' && paper.createdBy?.toString() !== requesterId) {
        return next(new ErrorResponse('Not authorized to update this exam question', 403));
    }

    if (req.body.topic) {
        const topic = await Topic.findById(req.body.topic);
        if (!topic) {
            return next(new ErrorResponse(`Topic not found with id of ${req.body.topic}`, 404));
        }
    }

    Object.assign(question, req.body);
    await question.save();

    res.status(200).json({
        success: true,
        data: question,
    });
});

// @desc    Delete exam question
// @route   DELETE /api/exams/questions/:questionId
// @access  Private (Teacher/Admin)
exports.deleteExamQuestion = asyncHandler(async (req, res, next) => {
    const { questionId } = req.params;
    const { id: requesterId, role } = getRequester(req);

    const question = await ExamQuestion.findById(questionId);
    if (!question) {
        return next(new ErrorResponse(`Exam question not found with id of ${questionId}`, 404));
    }

    const paper = await ExamPaper.findById(question.examPaper);
    if (!paper) {
        return next(new ErrorResponse('Parent exam paper not found', 404));
    }

    if (role === 'teacher' && paper.createdBy?.toString() !== requesterId) {
        return next(new ErrorResponse('Not authorized to delete this exam question', 403));
    }

    await question.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Exam question deleted successfully',
    });
});

// @desc    Validate an answer for an exam question
// @route   POST /api/exams/questions/:questionId/validate
// @access  Private (Student)
exports.validateExamAnswer = asyncHandler(async (req, res, next) => {
        const { questionId } = req.params;
        const { submittedAnswer } = req.body;
        const studentId = req.user.id || req.user._id;

        const question = await ExamQuestion.findById(questionId);
        if (!question) {
            return next(new ErrorResponse(`Exam question not found with id of ${questionId}`, 404));
        }

        const isCorrect = question.correctAnswer === submittedAnswer;

        const answer = await Answer.create({
            student: studentId,
            question: questionId,
            questionModel: 'ExamQuestion',
            submittedAnswer,
            isCorrect,
        });

        await appCache.invalidateUserProgress(String(studentId));

        res.status(200).json({
            success: true,
            isCorrect,
            correctAnswer: question.correctAnswer,
            answerExplanation: question.answerExplanation,
            answer,
        });
});
