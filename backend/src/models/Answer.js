const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'questionModel'
    },
    questionModel: {
      type: String,
      required: true,
      enum: ['ExerciseProblem', 'QuizProblem', 'ExamQuestion']
    },
    submittedAnswer: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Answer', answerSchema);
