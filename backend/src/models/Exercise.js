const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  topic: {
    type: Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [
    {
      type: String,
      required: true
    }
  ],
  correctAnswer: {
    type: Number, // Index of the correct option (0-3)
    required: true
  },
  hint: {
    type: String
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  description: {
    type: String
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

exerciseSchema.index({ topic: 1, createdAt: -1 });

module.exports = mongoose.model('Exercise', exerciseSchema);
