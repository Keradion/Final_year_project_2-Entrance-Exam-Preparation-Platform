const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createQuiz,
  addQuizProblem,
  updateQuiz,
  deleteQuiz,
  updateQuizProblem,
  deleteQuizProblem,
  getQuizzesByTopic,
  getQuizScore
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

// Route to get quizzes for a specific topic
router.route('/topics/:topicId/quizzes')
  .get(getQuizzesByTopic);

// Routes for quizzes
router.route('/')
  .post(protect, authorize('teacher'), createQuiz);

router.route('/:quizId')
  .put(protect, authorize('teacher', 'admin'), updateQuiz)
  .delete(protect, authorize('teacher', 'admin'), deleteQuiz);

router.route('/:quizId/problems')
  .post(protect, authorize('teacher'), addQuizProblem);

router.route('/:quizId/problems/:problemId')
  .put(protect, authorize('teacher', 'admin'), updateQuizProblem)
  .delete(protect, authorize('teacher', 'admin'), deleteQuizProblem);

router.route('/:quizId/score')
    .get(protect, authorize('student'), getQuizScore);

module.exports = router;
