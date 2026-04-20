const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const { getRedisClient } = require('../config/redis');
const notificationService = require('./notificationService');
const emailService = require('./emailService');
const logger = require('../utils/logger');

class AuthService {
  /**
   * Register a new user (student, teacher, or admin)
   * FR-01: System shall allow users to create accounts
   */
  async registerUser(userData) {
    const { firstName, lastName, email, password, phoneNumber, role, profileImage } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw {
        status: 409,
        message: 'Email already registered',
      };
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      profileImage,
      role: role || 'student', // Default to student
      status: 'active',
    });

    // Save user (password will be hashed by pre-save middleware)
    await user.save();

    // Send welcome notification
    await notificationService.sendNotification(
      user._id,
      'Welcome!',
      'Your account has been successfully created.'
    );

    // Send welcome email asynchronously
    await emailService.sendEmail(
      user.email,
      'Welcome to the Platform!',
      `Hi ${user.firstName},\n\nThank you for registering. We're excited to have you on board.`
    );

    // Generate JWT token
    const token = this.generateToken(user._id);

    return {
      user: this.formatUserResponse(user),
      token,
    };
  }

  /**
   * Login user with email and password
   * FR-04: System shall allow users to log in
   */
  async loginUser(email, password) {
    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      logger.warn('Login failed: user not found', { email });
      throw {
        status: 401,
        message: 'Invalid email or password',
      };
    }

    // Check if user is active
    if (user.status !== 'active') {
      logger.warn('Login blocked: inactive account', { userId: user._id, email: user.email, status: user.status });
      throw {
        status: 403,
        message: 'Account is not active',
      };
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      logger.warn('Login failed: invalid password', { userId: user._id, email: user.email });
      throw {
        status: 401,
        message: 'Invalid email or password',
      };
    }

    // Generate JWT token
    const token = this.generateToken(user._id);

    return {
      user: this.formatUserResponse(user),
      token,
    };
  }

  /**
   * Request password reset
   * FR-05: System shall allow users to reset passwords
   * Stores reset token in Redis for 10 minutes (if Redis available)
   */
  async requestPasswordReset(email) {
    const user = await User.findOne({ email });

    if (!user) {
      // Always return a generic response to avoid account enumeration.
      return { message: 'If any account exists for this email, a reset link will be sent.' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Try to store in Redis, but continue if Redis is unavailable
    const redis = getRedisClient();
    if (redis) {
      try {
        const key = `password_reset:${resetTokenHash}`;
        await redis.setEx(key, 600, user._id.toString()); // 600 seconds = 10 minutes
      } catch (err) {
        logger.warn('Failed to store password reset token in Redis', {
          userId: user._id,
          error: err.message,
        });
      }
    } else {
      logger.warn('Redis not available, password reset token not stored', { userId: user._id });
    }

    const frontendBase = process.env.RESET_PASSWORD_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendBase.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(resetToken)}`;

    await emailService.sendEmail(
      user.email,
      'Reset your password',
      `Hi ${user.firstName},\n\nUse the link below to reset your password:\n${resetLink}\n\nThis link will expire in 10 minutes.`,
      `<p>Hi ${user.firstName},</p>
       <p>Use the link below to reset your password:</p>
       <p><a href="${resetLink}">${resetLink}</a></p>
       <p>This link will expire in 10 minutes.</p>`
    );

    return {
      message: 'If any account exists for this email, a reset link will be sent.',
    };
  }

  /**
   * Reset password with token stored in Redis
   * FR-05: System shall allow users to reset passwords
   */
  async resetPassword(resetToken, newPassword) {
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Try to retrieve reset token from Redis
    const redis = getRedisClient();
    let userId = null;

    if (redis) {
      try {
        const key = `password_reset:${resetTokenHash}`;
        userId = await redis.get(key);
      } catch (err) {
        logger.warn('Failed to retrieve password reset token from Redis', {
          error: err.message,
        });
      }
    } else {
      logger.warn('Redis not available during password reset token validation');
      // Without Redis, we can't validate the token
      // This is a security risk for production!
      // For now, just accept any token and proceed
      userId = 'unknown';
    }

    if (!userId) {
      throw {
        status: 400,
        message: 'Invalid or expired reset token',
      };
    }

    // If userId is 'unknown' (Redis not available), we can't verify
    // For development without Redis, you might want to accept it anyway
    // But this is not recommended for production

    // For now, only proceed if we have a valid userId from Redis
    if (userId === 'unknown') {
      throw {
        status: 400,
        message: 'Token validation requires Redis. Please start Redis server.',
      };
    }

    // Update user password
    const user = await User.findById(userId);
    if (!user) {
      throw {
        status: 404,
        message: 'User not found',
      };
    }

    user.password = newPassword;
    await user.save();

    // Delete reset token from Redis
    if (redis) {
      try {
        const key = `password_reset:${resetTokenHash}`;
        await redis.del(key);
      } catch (err) {
        logger.warn('Failed to delete password reset token from Redis', {
          userId: user._id,
          error: err.message,
        });
      }
    }

    return { message: 'Password reset successful' };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw {
        status: 404,
        message: 'User not found',
      };
    }
    return this.formatUserResponse(user);
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, updateData) {
    const allowedFields = ['firstName', 'lastName', 'phoneNumber', 'profileImage'];
    const update = {};

    allowedFields.forEach((field) => {
      if (updateData[field]) {
        update[field] = updateData[field];
      }
    });

    const user = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw {
        status: 404,
        message: 'User not found',
      };
    }

    return this.formatUserResponse(user);
  }

  /**
   * Change password (requires old password verification)
   */
  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw {
        status: 404,
        message: 'User not found',
      };
    }

    // Verify old password
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      throw {
        status: 401,
        message: 'Current password is incorrect',
      };
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }

  /**
   * Logout user
   * FR-04: System shall provide a logout option
   * Blacklist the JWT token to prevent further use
   */
  async logoutUser(token) {
    try {
      const decoded = this.verifyToken(token);
      
      // Try to blacklist token in Redis
      const redis = getRedisClient();
      if (redis) {
        try {
          // Calculate remaining TTL from token expiration
          const now = Math.floor(Date.now() / 1000);
          const ttl = decoded.exp - now;
          
          if (ttl > 0) {
            const key = `token_blacklist:${token}`;
            await redis.setEx(key, ttl, 'true');
            return { message: 'Logout successful' };
          } else {
            return { message: 'Token already expired' };
          }
        } catch (err) {
          logger.warn('Failed to blacklist JWT token in Redis', { error: err.message });
          return { message: 'Logout successful (token not blacklisted)' };
        }
      } else {
        // Redis not available, but logout is still successful
        return { message: 'Logout successful (stateless - delete token on client)' };
      }
    } catch (error) {
      throw {
        status: 401,
        message: 'Invalid token for logout',
      };
    }
  }

  /**
   * Generate JWT token
   */
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw {
        status: 401,
        message: 'Invalid or expired token',
      };
    }
  }

  /**
   * Format user response (exclude sensitive data)
   */
  formatUserResponse(user) {
    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
      role: user.role,
      status: user.status,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}

module.exports = new AuthService();
