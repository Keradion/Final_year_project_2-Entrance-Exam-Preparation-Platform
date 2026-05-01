const mongoose = require('mongoose');

const subjectProgressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedTopics: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalTopics: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started',
    },
    milestonesNotified: [
      {
        type: Number,
        enum: [25, 50, 75, 100],
      },
    ],
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

subjectProgressSchema.index({ studentId: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.model('SubjectProgress', subjectProgressSchema);
