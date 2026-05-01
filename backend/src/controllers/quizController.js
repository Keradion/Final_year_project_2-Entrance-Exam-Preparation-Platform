const Quiz = require('../models/Quiz');
const QuizProblem = require('../models/QuizProblem');
const QuizScore = require('../models/QuizScore');
const Topic = require('../models/Topic');
const Chapter = require('../models/Chapter');
const Answer = require('../models/Answer');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errors');
const { notifyStudentsOfSubjectUpdate } = require('../services/contentNotificationService');

const getRequester = (req) => ({
    id: req.user?.id || req.user?._id?.toString(),
    role: req.user?.role,
});

const getSubjectIdForTopic = async (topicId) => {
    const topic = await Topic.findById(topicId).select('chapter').lean();
    if (!topic?.chapter) return null;
    const chapter = await Chapter.findById(topic.chapter).select('subject').lean();
    return chapter?.subject || null;
};

// @desc    Create a quiz
// @route   POST /api/quizzes
// @access  Private (Teacher)
exports.createQuiz = asyncHandler(async (req, res, next) => {
    req.body.createdBy = req.user.id;
    const { topic: topicId } = req.body;

    const topic = await Topic.findById(topicId);
    if (!topic) {
        return next(new ErrorResponse(`Topic not found with id of ${topicId}`, 404));
    }

    const quiz = await Quiz.create(req.body);

    const subjectId = await getSubjectIdForTopic(topicId);
    if (subjectId) {
        await notifyStudentsOfSubjectUpdate(
            subjectId,
            'New quiz available',
            `A new quiz "${quiz.title}" was added.`
        );
    }

    res.status(201).json({
        success: true,
        data: quiz
    });
});

// @desc    Add a problem to a quiz
// @route   POST /api/quizzes/:quizId/problems
// @access  Private (Teacher)
exports.addQuizProblem = asyncHandler(async (req, res, next) => {
    const { quizId } = req.params;
    req.body.quizId = quizId;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return next(new ErrorResponse(`Quiz not found with id of ${quizId}`, 404));
    }

    if (quiz.createdBy.toString() !== req.user.id) {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a problem to this quiz`, 401));
    }

    const problem = await QuizProblem.create(req.body);

    res.status(201).json({
        success: true,
        data: problem
    });
});

// @desc    Update a quiz
// @route   PUT /api/quizzes/:quizId
// @access  Private (Teacher/Admin)
exports.updateQuiz = asyncHandler(async (req, res, next) => {
    const { quizId } = req.params;
    const { id: requesterId, role } = getRequester(req);

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return next(new ErrorResponse(`Quiz not found with id of ${quizId}`, 404));
    }

    if (role === 'teacher' && quiz.createdBy.toString() !== requesterId) {
        return next(new ErrorResponse('Not authorized to update this quiz', 403));
    }

    if (req.body.topic) {
        const topic = await Topic.findById(req.body.topic);
        if (!topic) {
            return next(new ErrorResponse(`Topic not found with id of ${req.body.topic}`, 404));
        }
    }

    Object.assign(quiz, req.body);
    await quiz.save();

    const subjectId = await getSubjectIdForTopic(quiz.topic);
    if (subjectId) {
        await notifyStudentsOfSubjectUpdate(
            subjectId,
            'Quiz updated',
            `Quiz "${quiz.title}" was updated.`
        );
    }

    res.status(200).json({
        success: true,
        data: quiz,
    });
});

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:quizId
// @access  Private (Teacher/Admin)
exports.deleteQuiz = asyncHandler(async (req, res, next) => {
    const { quizId } = req.params;
    const { id: requesterId, role } = getRequester(req);

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return next(new ErrorResponse(`Quiz not found with id of ${quizId}`, 404));
    }

    if (role === 'teacher' && quiz.createdBy.toString() !== requesterId) {
        return next(new ErrorResponse('Not authorized to delete this quiz', 403));
    }

    await QuizProblem.deleteMany({ quizId });
    await QuizScore.deleteMany({ quiz: quizId });
    await quiz.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Quiz deleted successfully',
    });
});

// @desc    Update a quiz problem
// @route   PUT /api/quizzes/:quizId/problems/:problemId
// @access  Private (Teacher/Admin)
exports.updateQuizProblem = asyncHandler(async (req, res, next) => {
    const { quizId, problemId } = req.params;
    const { id: requesterId, role } = getRequester(req);

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return next(new ErrorResponse(`Quiz not found with id of ${quizId}`, 404));
    }

    if (role === 'teacher' && quiz.createdBy.toString() !== requesterId) {
        return next(new ErrorResponse('Not authorized to update this quiz problem', 403));
    }

    const problem = await QuizProblem.findOne({ _id: problemId, quizId });
    if (!problem) {
        return next(new ErrorResponse(`Quiz problem not found with id of ${problemId}`, 404));
    }

    Object.assign(problem, req.body);
    await problem.save();

    res.status(200).json({
        success: true,
        data: problem,
    });
});

// @desc    Delete a quiz problem
// @route   DELETE /api/quizzes/:quizId/problems/:problemId
// @access  Private (Teacher/Admin)
exports.deleteQuizProblem = asyncHandler(async (req, res, next) => {
    const { quizId, problemId } = req.params;
    const { id: requesterId, role } = getRequester(req);

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return next(new ErrorResponse(`Quiz not found with id of ${quizId}`, 404));
    }

    if (role === 'teacher' && quiz.createdBy.toString() !== requesterId) {
        return next(new ErrorResponse('Not authorized to delete this quiz problem', 403));
    }

    const deleted = await QuizProblem.findOneAndDelete({ _id: problemId, quizId });
    if (!deleted) {
        return next(new ErrorResponse(`Quiz problem not found with id of ${problemId}`, 404));
    }

    res.status(200).json({
        success: true,
        message: 'Quiz problem deleted successfully',
    });
});

// @desc    Get quizzes by topic
// @route   GET /api/topics/:topicId/quizzes
// @access  Public
exports.getQuizzesByTopic = asyncHandler(async (req, res, next) => {
    const { topicId } = req.params;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const topic = await Topic.findById(topicId);
    if (!topic) {
        return next(new ErrorResponse(`Topic not found with id of ${topicId}`, 404));
    }

    const filter = { topic: topicId };
    const [quizzes, total] = await Promise.all([
      Quiz.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Quiz.countDocuments(filter),
    ]);

    res.status(200).json({
        success: true,
        count: quizzes.length,
        total,
        page,
        pages: Math.ceil(total / limit) || 1,
        limit,
        data: quizzes
    });
});

// @desc    Get quiz score for a student
// @route   GET /api/quizzes/:quizId/score
// @access  Private (Student)
exports.getQuizScore = asyncHandler(async (req, res, next) => {
    const { quizId } = req.params;
    const studentId = req.user.id;

    const score = await QuizScore.findOne({ quiz: quizId, student: studentId });

    if (!score) {
        return next(new ErrorResponse(`No score found for this quiz for the current student`, 404));
    }

    res.status(200).json({
        success: true,
        data: score
    });
});

// @desc    Validate quiz answer interactively
// @route   POST /api/quizzes/problems/:problemId/validate
// @access  Private (Student)
exports.validateQuizAnswer = asyncHandler(async (req, res, next) => {
    const { problemId } = req.params;
    const { submittedAnswer } = req.body;
    const studentId = req.user.id || req.user._id;

    if (!submittedAnswer) {
        return next(new ErrorResponse('submittedAnswer is required', 400));
    }

    const problem = await QuizProblem.findById(problemId);
    if (!problem) {
        return next(new ErrorResponse(`Quiz problem not found with id of ${problemId}`, 404));
    }

    const isCorrect = problem.correctAnswer === submittedAnswer;

    const answer = await Answer.create({
        student: studentId,
        question: problemId,
        questionModel: 'QuizProblem',
        submittedAnswer,
        isCorrect
    });

    if (isCorrect) {
        await QuizScore.findOneAndUpdate(
            { quiz: problem.quizId, student: studentId },
            { $inc: { score: 1 } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    }

    res.status(200).json({
        success: true,
        isCorrect,
        correctAnswer: problem.correctAnswer,
        answerExplanation: problem.answerExplanation,
        answer
    });
});
