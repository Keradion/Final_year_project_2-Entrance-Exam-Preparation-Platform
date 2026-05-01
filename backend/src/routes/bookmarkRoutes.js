const express = require('express');
const router = express.Router();
const { addBookmark, removeBookmark, getBookmarks } = require('../controllers/bookmarkController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('student'));

router.route('/').post(addBookmark).get(getBookmarks);
router.route('/:bookmarkId').delete(removeBookmark);

module.exports = router;

