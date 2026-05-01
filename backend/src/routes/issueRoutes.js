const express = require('express');
const router = express.Router();
const {
  submitIssue,
  getMyIssues,
  getIssuesForReview,
  updateIssueStatus,
} = require('../controllers/issueController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('student'), submitIssue);
router.get('/me', protect, authorize('student'), getMyIssues);
router.get('/', protect, authorize('teacher', 'admin'), getIssuesForReview);
router.put('/:issueId/status', protect, authorize('teacher', 'admin'), updateIssueStatus);

module.exports = router;

