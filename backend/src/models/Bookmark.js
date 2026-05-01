const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    resourceType: {
      type: String,
      enum: ['topic', 'video', 'concept', 'exercise', 'quiz', 'exercise-question', 'exam-question'],
      required: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Bookmark note cannot exceed 500 characters'],
      default: '',
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

bookmarkSchema.index({ studentId: 1, resourceType: 1, resourceId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
