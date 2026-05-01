const express = require('express');
const router = express.Router();
const {
  askQuestion,
  updateQuestion,
  deleteQuestion,
  listQuestions,
  getTopicQuestions,
  searchQuestions,
  getQuestionById,
} = require('../controllers/questionController');
const {
  answerQuestion,
  updateAnswer,
  deleteAnswer,
  getAnswersForQuestion,
} = require('../controllers/questionAnswerController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('student'), askQuestion);
router.get('/', authorize('student', 'teacher', 'admin'), listQuestions);
router.put('/:questionId', authorize('student'), updateQuestion);
router.delete('/:questionId', authorize('student'), deleteQuestion);
router.get('/topics/:topicId', authorize('student', 'teacher', 'admin'), getTopicQuestions);
router.get('/search', authorize('student', 'teacher', 'admin'), searchQuestions);
router.get('/:questionId', authorize('student', 'teacher', 'admin'), getQuestionById);

router.get('/:questionId/answers', authorize('student', 'teacher', 'admin'), getAnswersForQuestion);
router.post('/:questionId/answers', authorize('teacher'), answerQuestion);
router.put('/:questionId/answers/:answerId', authorize('teacher'), updateAnswer);
router.delete('/:questionId/answers/:answerId', authorize('teacher'), deleteAnswer);

module.exports = router;

