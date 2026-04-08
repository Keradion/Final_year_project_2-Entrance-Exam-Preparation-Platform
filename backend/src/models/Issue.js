const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Issue title is required'],
      trim: true,
    },
    issueDescription: {
      type: String,
      required: [true, 'Issue description is required'],
    },
    issueType: {
      type: String,
      enum: ['bug', 'feature-request', 'error', 'other'],
      default: 'other',
    },
    issueStatus: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    response: {
      type: String,
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

module.exports = mongoose.model('Issue', issueSchema);
