const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: [true, 'Topic is required'],
      index: true,
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
    },
    views: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['open', 'answered'],
      default: 'open',
      index: true,
    },
    answeredAt: {
      type: Date,
      default: null,
    },
    answeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

questionSchema.index({ questionText: 'text' });
questionSchema.index({ topicId: 1, created_at: -1 });

module.exports = mongoose.model('Question', questionSchema);
