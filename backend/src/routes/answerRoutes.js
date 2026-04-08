const express = require('express');
const router = express.Router();
const { submitAnswer } = require('../controllers/answerController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, authorize('student'), submitAnswer);

module.exports = router;
