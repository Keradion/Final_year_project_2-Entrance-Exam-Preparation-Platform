const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const examPaperSchema = new Schema({
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  year: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  }
}, { timestamps: true });

examPaperSchema.index({ subject: 1, year: -1, createdAt: -1 });
examPaperSchema.index({ year: -1, createdAt: -1 });
examPaperSchema.index({ title: 1 });
examPaperSchema.index({ createdBy: 1, createdAt: -1 });

module.exports = mongoose.model('ExamPaper', examPaperSchema);
