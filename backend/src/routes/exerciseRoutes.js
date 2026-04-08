const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createExercise,
  addExerciseProblem,
  updateExercise,
  deleteExercise,
  updateExerciseProblem,
  deleteExerciseProblem,
  getExercisesByTopic,
  submitProblemAnswer
} = require('../controllers/exerciseController');
const { protect, authorize } = require('../middleware/auth');

// Route to get exercises for a specific topic
router.route('/topics/:topicId/exercises')
  .get(getExercisesByTopic);

// Routes for a specific exercise
router.route('/')
  .post(protect, authorize('teacher'), createExercise);

router.route('/:exerciseId')
  .put(protect, authorize('teacher', 'admin'), updateExercise)
  .delete(protect, authorize('teacher', 'admin'), deleteExercise);

router.route('/:exerciseId/problems')
  .post(protect, authorize('teacher'), addExerciseProblem);

router.route('/:exerciseId/problems/:problemId')
  .put(protect, authorize('teacher', 'admin'), updateExerciseProblem)
  .delete(protect, authorize('teacher', 'admin'), deleteExerciseProblem);

router.route('/problems/:problemId/submit')
  .post(protect, authorize('student'), submitProblemAnswer);

module.exports = router;
