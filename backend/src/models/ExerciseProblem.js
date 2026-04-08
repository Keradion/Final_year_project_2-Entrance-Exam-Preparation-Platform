const mongoose = require('mongoose');

const exerciseProblemSchema = new mongoose.Schema(
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
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('ExerciseProblem', exerciseProblemSchema);
