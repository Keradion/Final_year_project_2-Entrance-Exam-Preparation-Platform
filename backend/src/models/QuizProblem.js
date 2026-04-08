const mongoose = require('mongoose');

const quizProblemSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
    },
    questionImageUrl: {
      type: String,
      default: null,
    },
    choices: [
      {
        text: String,
        value: String,
      },
    ],
    correctAnswer: {
      type: String,
      required: true,
    },
    answerExplanation: {
      type: String,
      trim: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('QuizProblem', quizProblemSchema);
