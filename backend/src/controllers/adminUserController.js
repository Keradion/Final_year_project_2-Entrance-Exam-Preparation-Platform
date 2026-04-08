const mongoose = require('mongoose');
const { User } = require('../models');
const notificationService = require('../services/notificationService');

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
const MANAGED_ROLES = new Set(['student', 'teacher']);
const ALLOWED_STATUSES = new Set(['active', 'inactive', 'suspended']);

class AdminUserController {
  async listUsers(req, res, next) {
    try {
      const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
      const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
      const skip = (page - 1) * limit;
      const query = {
        role: { $in: ['student', 'teacher'] },
      };

      if (req.query.role) {
        if (!MANAGED_ROLES.has(req.query.role)) {
          return res.status(400).json({ success: false, message: 'Role must be student or teacher.' });
        }
        query.role = req.query.role;
      }

      if (req.query.status) {
        if (!ALLOWED_STATUSES.has(req.query.status)) {
          return res.status(400).json({ success: false, message: 'Invalid status filter.' });
        }
        query.status = req.query.status;
      }

      if (req.query.q) {
        query.$or = [
          { firstName: { $regex: req.query.q, $options: 'i' } },
          { lastName: { $regex: req.query.q, $options: 'i' } },
          { email: { $regex: req.query.q, $options: 'i' } },
        ];
      }

      const [users, total] = await Promise.all([
        User.find(query)
          .select('firstName lastName email phoneNumber profileImage role status created_at updated_at')
          .sort({ created_at: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments(query),
      ]);

      res.status(200).json({
        success: true,
        count: users.length,
        total,
        page,
        pages: Math.ceil(total / limit) || 1,
        limit,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { userId } = req.params;
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user id format.' });
      }

      const user = await User.findOne({ _id: userId, role: { $in: ['student', 'teacher'] } })
        .select('firstName lastName email phoneNumber profileImage role status created_at updated_at')
        .lean();

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!isValidObjectId(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user id format.' });
      }

      if (!MANAGED_ROLES.has(role)) {
        return res.status(400).json({ success: false, message: 'Role must be student or teacher.' });
      }

      const user = await User.findOne({ _id: userId, role: { $in: ['student', 'teacher'] } });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (user.role === role) {
        return res.status(200).json({ success: true, message: 'Role unchanged.', data: user });
      }

      const previousRole = user.role;
      user.role = role;
      await user.save();

      await notificationService.sendNotification(
        user._id,
        'Account role updated',
        `Your account role was changed from ${previousRole} to ${role} by an administrator.`
      );

      res.status(200).json({ success: true, message: 'User role updated successfully', data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateUserStatus(req, res, next) {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      if (!isValidObjectId(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user id format.' });
      }

      if (!ALLOWED_STATUSES.has(status)) {
        return res.status(400).json({ success: false, message: 'Status must be active, inactive, or suspended.' });
      }

      const user = await User.findOne({ _id: userId, role: { $in: ['student', 'teacher'] } });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (user.status === status) {
        return res.status(200).json({ success: true, message: 'Status unchanged.', data: user });
      }

      const previousStatus = user.status;
      user.status = status;
      await user.save();

      await notificationService.sendNotification(
        user._id,
        'Account status updated',
        `Your account status was changed from ${previousStatus} to ${status} by an administrator.`
      );

      res.status(200).json({ success: true, message: 'User status updated successfully', data: user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminUserController();
