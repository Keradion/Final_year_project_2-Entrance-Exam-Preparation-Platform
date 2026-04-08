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
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  },
  attemptDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

quizScoreSchema.index({ quiz: 1, student: 1 }, { unique: true });
quizScoreSchema.index({ student: 1, status: 1, attemptDate: -1 });

module.exports = mongoose.model('QuizScore', quizScoreSchema);
