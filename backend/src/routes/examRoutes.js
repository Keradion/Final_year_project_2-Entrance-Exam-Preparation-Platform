const express = require('express');
const router = express.Router();
const {
  getExamPapersBySubject,
  searchExamPapers,
  createExamPaper,
  updateExamPaper,
  deleteExamPaper,
} = require('../controllers/examPaperController');
const {
  getExamQuestionsByPaper,
  searchExamQuestions,
  addExamQuestion,
  updateExamQuestion,
  deleteExamQuestion,
  validateExamAnswer,
} = require('../controllers/examQuestionController');
const { protect, authorize } = require('../middleware/auth');

// Exam Paper routes
router.get('/papers/subjects/:subjectId', getExamPapersBySubject);
router.get('/papers/search', searchExamPapers);
router.post('/papers', protect, authorize('teacher', 'admin'), createExamPaper);
router.put('/papers/:paperId', protect, authorize('teacher', 'admin'), updateExamPaper);
router.delete('/papers/:paperId', protect, authorize('teacher', 'admin'), deleteExamPaper);

// Exam Question routes
router.get('/papers/:paperId/questions', getExamQuestionsByPaper);
router.get('/questions/search', searchExamQuestions);
router.post('/papers/:paperId/questions', protect, authorize('teacher', 'admin'), addExamQuestion);
router.put('/questions/:questionId', protect, authorize('teacher', 'admin'), updateExamQuestion);
router.delete('/questions/:questionId', protect, authorize('teacher', 'admin'), deleteExamQuestion);
router.post('/questions/:questionId/validate', protect, authorize('student'), validateExamAnswer);

module.exports = router;
