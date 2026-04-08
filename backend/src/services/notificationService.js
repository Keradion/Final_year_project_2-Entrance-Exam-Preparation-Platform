const Notification = require('../models/Notification');

class NotificationService {
  /**
   * Create a new notification
   * @param {string} userId - The ID of the user to notify
   * @param {string} title - The title of the notification
   * @param {string} message - The message content of the notification
   * @returns {Promise<Notification>}
   */
  async sendNotification(userId, title, message) {
    try {
      const notification = new Notification({
        userId,
        title,
        message,
      });
      await notification.save();
      return notification;
    } catch (error) {
      console.error(`Error sending notification: ${error.message}`);
      // In a real-world app, you might want to throw the error
      // or handle it in a more sophisticated way (e.g., retry logic, logging service)
    }
  }

  /**
   * Get all notifications for a specific user
   * @param {string} userId - The ID of the user
   * @returns {Promise<Notification[]>}
   */
  async getAllUserNotifications(userId) {
    return Notification.find({ userId }).sort({ created_at: -1 });
  }

  /**
   * Get all unread notifications for a specific user
   * @param {string} userId - The ID of the user
   * @returns {Promise<Notification[]>}
   */
  async getUserUnreadNotifications(userId) {
    return Notification.find({ userId, readAt: null }).sort({ created_at: -1 });
  }

  /**
   * Mark a specific notification as read
   * @param {string} notificationId - The ID of the notification
   * @param {string} userId - The ID of the user who owns the notification
   * @returns {Promise<Notification|null>}
   */
  async markNotificationRead(notificationId, userId) {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return null; // Or throw an error
    }

    // Ensure the notification belongs to the user trying to mark it as read
    if (notification.userId.toString() !== userId) {
      // In a real app, you'd throw an authorization error
      return null;
    }

    if (notification.readAt === null) {
      notification.readAt = new Date();
      await notification.save();
    }

    return notification;
  }
}

module.exports = new NotificationService();
