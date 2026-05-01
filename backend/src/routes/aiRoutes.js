const express = require('express');
const { chat } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/chat', protect, authorize('student'), chat);

module.exports = router;
