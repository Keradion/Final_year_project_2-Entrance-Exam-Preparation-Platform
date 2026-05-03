const Quiz = require('../models/Quiz');
const QuizProblem = require('../models/QuizProblem');
const QuizScore = require('../models/QuizScore');
const Topic = require('../models/Topic');
const Chapter = require('../models/Chapter');
const Answer = require('../models/Answer');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errors');
const appCache = require('../services/appCache');
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
    let quizzes = await Quiz.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    const total = await Quiz.countDocuments(filter);

    // If student, attach their attempt status for each quiz
    if (req.user && req.user.role === 'student') {
        const studentId = req.user.id;
        quizzes = await Promise.all(quizzes.map(async (quiz) => {
            const score = await QuizScore.findOne({ quiz: quiz._id, student: studentId }).select('score status').lean();
            return { ...quiz, userScore: score };
        }));
    }

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

// @desc    Get a specific quiz
// @route   GET /api/quizzes/:quizId
// @access  Private
exports.getQuiz = asyncHandler(async (req, res, next) => {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
        return next(new ErrorResponse(`Quiz not found with id of ${quizId}`, 404));
    }

    const problems = await QuizProblem.find({ quizId });

    // Check for existing user score
    let userScore = null;
    if (req.user && req.user.role === 'student') {
        userScore = await QuizScore.findOne({ 
            quizId, 
            studentId: req.user.id,
            status: 'completed' 
        });
    }

    res.status(200).json({
        success: true,
        data: {
            ...quiz._doc,
            problems,
            userScore
        }
    });
});

// @desc    Start a quiz attempt
// @route   POST /api/quizzes/:quizId/start
// @access  Private (Student)
exports.startQuizAttempt = asyncHandler(async (req, res, next) => {
    const { quizId } = req.params;
    const studentId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return next(new ErrorResponse(`Quiz not found with id of ${quizId}`, 404));
    }

    let score = await QuizScore.findOne({ quiz: quizId, student: studentId });

    if (score && score.status === 'completed' && score.score >= 50) {
        return next(new ErrorResponse('You have already completed this quiz with a passing score.', 400));
    }

    if (!score) {
        score = await QuizScore.create({
            quiz: quizId,
            student: studentId,
            status: 'in-progress',
            startTime: new Date(),
            score: 0
        });
    } else {
        score.status = 'in-progress';
        score.startTime = new Date();
        score.endTime = null;
        score.score = 0;
        await score.save();
    }

    res.status(200).json({
        success: true,
        data: score
    });
});

// @desc    Submit a quiz attempt
// @route   POST /api/quizzes/:quizId/submit
// @access  Private (Student)
exports.submitQuizAttempt = asyncHandler(async (req, res, next) => {
    const { quizId } = req.params;
    const { answers } = req.body; // Array of { problemId, submittedAnswer }
    const studentId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return next(new ErrorResponse(`Quiz not found with id of ${quizId}`, 404));
    }

    const scoreEntry = await QuizScore.findOne({ quiz: quizId, student: studentId });
    if (!scoreEntry || scoreEntry.status !== 'in-progress') {
        return next(new ErrorResponse('No active quiz attempt found. Please start the quiz first.', 400));
    }

    // Check if time is up (adding a small grace period)
    const now = new Date();
    const startTime = new Date(scoreEntry.startTime);
    const durationMs = quiz.duration * 60 * 1000;
    const timeElapsed = now - startTime;

    if (timeElapsed > durationMs + 10000) { // 10s grace period
        scoreEntry.status = 'reset';
        scoreEntry.score = 0;
        scoreEntry.endTime = now;
        await scoreEntry.save();
        return next(new ErrorResponse('Time is up! Your quiz has been reset.', 400));
    }

    const problems = await QuizProblem.find({ quizId });
    let correctCount = 0;
    const detailedResults = [];
    const answersToCreate = [];

    for (const problem of problems) {
        const submission = answers.find(a => a.problemId === problem._id.toString());
        const submittedAnswer = submission ? submission.submittedAnswer : null;
        const isCorrect = submittedAnswer === problem.correctAnswer;

        if (isCorrect) correctCount++;

        answersToCreate.push({
            student: studentId,
            question: problem._id,
            questionModel: 'QuizProblem',
            submittedAnswer: submittedAnswer || 'No Answer',
            isCorrect
        });

        detailedResults.push({
            problemId: problem._id,
            questionText: problem.questionText,
            choices: problem.choices,
            correctAnswer: problem.correctAnswer,
            submittedAnswer,
            isCorrect,
            answerExplanation: problem.answerExplanation
        });
    }

    // Bulk save answers
    if (answersToCreate.length > 0) {
        await Answer.insertMany(answersToCreate);
    }

    const percentage = (correctCount / problems.length) * 100;
    scoreEntry.score = percentage;
    scoreEntry.status = 'completed';
    scoreEntry.endTime = now;
    
    // Save answers and a map of detailed results for later viewing
    scoreEntry.answers = answers.map(a => ({ problemId: a.problemId, answer: a.submittedAnswer }));
    const resultsMap = {};
    detailedResults.forEach(r => {
        resultsMap[r.problemId.toString()] = r;
    });
    scoreEntry.detailedResults = resultsMap;

    await scoreEntry.save();

    // Auto-complete topic if score >= 50%
    let topicCompleted = false;
    if (percentage >= 50) {
        const { markTopicCompleted } = require('../services/progressService');
        await markTopicCompleted(studentId, quiz.topic);
        topicCompleted = true;

        // Send congratulatory email (Non-blocking)
        const { User } = require('../models');
        const emailService = require('../services/emailService');
        
        User.findById(studentId).then(user => {
            if (user && user.email) {
                emailService.sendEmail(
                    user.email,
                    `Congratulations! You passed the quiz: ${quiz.title}`,
                    `Well done ${user.firstName}! You scored ${Math.round(percentage)}% in the ${quiz.title} assessment. You can now proceed to the next topic.`,
                    `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; padding: 40px; background-color: #ffffff;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="background-color: #f0fdf4; width: 64px; height: 64px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                                <span style="font-size: 32px;">🎓</span>
                            </div>
                            <h1 style="color: #10b981; margin: 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;">Academic Excellence</h1>
                        </div>
                        
                        <p style="font-size: 16px; color: #374151; line-height: 1.6;">Hello <strong>${user.firstName}</strong>,</p>
                        
                        <p style="font-size: 16px; color: #374151; line-height: 1.6;">Outstanding work! You have successfully completed the <strong>${quiz.title}</strong> assessment with a score of <span style="color: #10b981; font-weight: 800;">${Math.round(percentage)}%</span>.</p>
                        
                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid #f3f4f6;">
                            <p style="margin: 0; font-size: 14px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Status</p>
                            <p style="margin: 4px 0 0 0; font-size: 18px; color: #111827; font-weight: 700;">Topic Completed & Passed</p>
                        </div>
                        
                        <p style="font-size: 16px; color: #374151; line-height: 1.6;">You are now eligible to proceed to the next topic in your curriculum. Your progress has been updated automatically.</p>
                        
                        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #f3f4f6;">
                            <p style="font-size: 14px; color: #9ca3af; margin: 0;">This is an automated notification from EduPortal. Keep up the great work!</p>
                        </div>
                    </div>
                    `
                ).catch(err => console.error('Email send error:', err));
            }
        }).catch(err => console.error('User fetch error for email:', err));
    }

    await appCache.invalidateUserProgress(String(studentId));

    const responseData = {
        ...scoreEntry._doc,
        message: percentage >= 50 
            ? 'Congratulations! You passed the quiz and completed the topic.' 
            : 'Score below 50%. You must retry the wrong questions.'
    };

    if (percentage < 50) {
        delete responseData.detailedResults;
        delete responseData.answers;
    }

    res.status(200).json({
        success: true,
        data: responseData
    });
});

// @desc    Reset quiz attempt (if closed in between)
// @route   POST /api/quizzes/:quizId/reset
// @access  Private (Student)
exports.resetQuizAttempt = asyncHandler(async (req, res, next) => {
    const { quizId } = req.params;
    const studentId = req.user.id;

    const scoreEntry = await QuizScore.findOne({ quiz: quizId, student: studentId });
    if (scoreEntry && scoreEntry.status === 'in-progress') {
        scoreEntry.status = 'reset';
        scoreEntry.score = 0;
        await scoreEntry.save();
    }

    res.status(200).json({
        success: true,
        message: 'Quiz attempt reset to zero.'
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

// @desc    Validate quiz answer interactively (Keep for compatibility if needed, but not used for batch)
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

    await appCache.invalidateUserProgress(String(studentId));

    res.status(200).json({
        success: true,
        isCorrect,
        correctAnswer: problem.correctAnswer,
        answerExplanation: problem.answerExplanation,
        answer
    });
});
