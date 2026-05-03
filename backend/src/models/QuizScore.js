const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizScoreSchema = new Schema({
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Student
    required: true
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed', 'reset'],
    default: 'not-started'
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  attemptDate: {
    type: Date,
    default: Date.now
  },
  answers: [{
    problemId: String,
    answer: String
  }],
  detailedResults: {
    type: Schema.Types.Mixed
  }
}, { timestamps: true });

quizScoreSchema.index({ quiz: 1, student: 1 }, { unique: true });
quizScoreSchema.index({ student: 1, status: 1, attemptDate: -1 });

module.exports = mongoose.model('QuizScore', quizScoreSchema);
