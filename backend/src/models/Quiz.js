const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  topic: {
    type: Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  duration: {
    type: Number, // duration in minutes
    required: true,
    default: 30
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Teacher
    required: true
  }
}, { timestamps: true });

quizSchema.index({ topic: 1, createdAt: -1 });

module.exports = mongoose.model('Quiz', quizSchema);
