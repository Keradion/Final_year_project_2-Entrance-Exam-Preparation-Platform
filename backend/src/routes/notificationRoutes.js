const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth'); // Assuming you have auth middleware

// All routes in this file are protected
router.use(authenticate);

// GET all notifications for the logged-in user
router.get('/', notificationController.getAllUserNotifications);

// GET all unread notifications for the logged-in user
router.get('/unread', notificationController.getUserUnreadNotifications);

// PUT mark a notification as read
router.put('/:id/read', notificationController.markNotificationRead);

module.exports = router;