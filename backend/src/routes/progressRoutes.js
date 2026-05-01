const express = require('express');
const {
  completeTopic,
  getMyChapterProgressForSubject,
  getMyGradeProgress,
  getMyLearningStreak,
  getMyProgressForSubject,
  getMyResultsSummary,
  getMySubjectProgress,
  getTopicCompletionEligibility,
} = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('student'));

router.get('/subjects', getMySubjectProgress);
router.get('/results', getMyResultsSummary);
router.get('/streak', getMyLearningStreak);
router.get('/grades/:gradeLevel', getMyGradeProgress);
router.get('/subjects/:subjectId/chapters', getMyChapterProgressForSubject);
router.get('/subjects/:subjectId', getMyProgressForSubject);
router.get('/topics/:topicId/eligibility', getTopicCompletionEligibility);
router.post('/topics/:topicId/complete', completeTopic);

module.exports = router;
