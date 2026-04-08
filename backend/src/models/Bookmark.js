const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    resourceType: {
      type: String,
      enum: ['topic', 'video', 'concept', 'exercise', 'quiz'],
      required: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Bookmark', bookmarkSchema);
