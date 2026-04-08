const notificationService = require('../services/notificationService');

class NotificationController {
  /**
   * GET /api/notifications
   * Get all notifications for the logged-in user
   */
  async getAllUserNotifications(req, res, next) {
    try {
      const notifications = await notificationService.getAllUserNotifications(req.user.id);
      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/notifications/unread
   * Get all unread notifications for the logged-in user
   */
  async getUserUnreadNotifications(req, res, next) {
    try {
      const notifications = await notificationService.getUserUnreadNotifications(req.user.id);
      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/notifications/:id/read
   * Mark a notification as read
   */
  async markNotificationRead(req, res, next) {
    try {
      const notification = await notificationService.markNotificationRead(req.params.id, req.user.id);

      if (!notification) {
        return res.status(404).json({ success: false, message: 'Notification not found or not authorized' });
      }

      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();