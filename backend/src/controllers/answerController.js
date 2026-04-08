const Answer = require('@/models/Answer');
const QuizProblem = require('@/models/QuizProblem');
const ExerciseProblem = require('@/models/ExerciseProblem');
const ExamQuestion = require('@/models/ExamQuestion');
const QuizScore = require('@/models/QuizScore');

const questionModels = {
    QuizProblem,
    ExerciseProblem,
    ExamQuestion
};

// @desc    Submit an answer for any question
// @route   POST /api/answers
// @access  Private (Student)
exports.submitAnswer = async (req, res) => {
    const { questionId, questionModel, submittedAnswer } = req.body;
    const studentId = req.user.id;

    // 1. Find the question to get the correct answer
    const QuestionModel = questionModels[questionModel];
    if (!QuestionModel) {
        return res.status(400).json({ message: 'Invalid question type' });
    }
    const question = await QuestionModel.findById(questionId);
    if (!question) {
        return res.status(404).json({ message: 'Question not found' });
    }

    // 2. Check if the answer is correct
    const isCorrect = question.correctAnswer === submittedAnswer;

    // 3. Save the answer
    const answer = await Answer.create({
        student: studentId,
        question: questionId,
        questionModel,
        submittedAnswer,
        isCorrect
    });

    // 4. If it's a quiz, update the score
    if (questionModel === 'QuizProblem' && isCorrect) {
        const quizId = question.quizId;
        const score = await QuizScore.findOneAndUpdate(
            { quiz: quizId, student: studentId },
            { $inc: { score: 1 } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    }

    res.status(201).json({
        success: true,
        isCorrect,
        correctAnswer: question.correctAnswer,
        answerExplanation: question.answerExplanation,
        answer
    });
};
