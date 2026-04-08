const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const examQuestionSchema = new Schema({
  examPaper: {
    type: Schema.Types.ObjectId,
    ref: 'ExamPaper',
    required: true
  },
  topic: {
    type: Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  questionImageUrl: {
    type: String
  },
  choices: [{
    type: String
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  answerExplanation: {
    type: String
  }
}, { timestamps: true });

examQuestionSchema.index({ examPaper: 1, createdAt: 1 });
examQuestionSchema.index({ topic: 1 });

module.exports = mongoose.model('ExamQuestion', examQuestionSchema);
