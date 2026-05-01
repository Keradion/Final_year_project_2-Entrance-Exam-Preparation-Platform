const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, PendingUser } = require('../models');
const { getRedisClient } = require('../config/redis');
const notificationService = require('./notificationService');
const emailService = require('./emailService');
const logger = require('../utils/logger');

class AuthService {
  getGeminiKeyEncryptionKey() {
    const secret = process.env.GEMINI_KEY_ENCRYPTION_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      throw { status: 500, message: 'Gemini key encryption secret is not configured' };
    }
    return crypto.createHash('sha256').update(secret).digest();
  }

  encryptGeminiApiKey(apiKey) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.getGeminiKeyEncryptionKey(), iv);
    const encrypted = Buffer.concat([cipher.update(apiKey, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted.toString('base64')}`;
  }

  decryptGeminiApiKey(encryptedValue) {
    const [ivRaw, authTagRaw, encryptedRaw] = encryptedValue.split(':');
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      this.getGeminiKeyEncryptionKey(),
      Buffer.from(ivRaw, 'base64')
    );
    decipher.setAuthTag(Buffer.from(authTagRaw, 'base64'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedRaw, 'base64')),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  }

  /**
   * Register a new user (student, teacher, or admin)
   * FR-01: System shall allow users to create accounts
   */
  async registerUser(userData) {
    const { firstName, lastName, email, password, phoneNumber, role, profileImage, stream, gradeLevel } = userData;
    const requestedRole = role || 'student';

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { status: 409, message: 'Email already registered' };
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // If teacher, register immediately (per requirement: only non-teachers go through verification stage)
    if (requestedRole === 'teacher') {
      const user = new User({
        firstName, lastName, email, password, phoneNumber, profileImage,
        role: 'teacher', status: 'active', isEmailVerified: true, stream, gradeLevel
      });
      await user.save();
      const token = this.generateToken(user._id);
      return { user: this.formatUserResponse(user), token, verificationRequired: false };
    }

    // For students/others, create pending registration
    await PendingUser.findOneAndDelete({ email }); // Clear any previous attempt
    const pendingUser = new PendingUser({
      firstName, lastName, email, password, phoneNumber, profileImage,
      role: requestedRole, stream, gradeLevel: requestedRole === 'student' ? null : gradeLevel, verificationCode
    });
    await pendingUser.save();

    // Send verification email
    await emailService.sendEmail(
      email,
      'Registration Verification',
      `Your verification code: ${verificationCode}`,
      `<div style="font-family: sans-serif; text-align: center; padding: 40px; color: #0f172a;">
        <h1 style="font-size: 24px; font-weight: 900; margin-bottom: 8px;">Entrance Exam Prep</h1>
        <p style="color: #64748b; margin-bottom: 24px;">Verification code for your account registration:</p>
        <div style="font-size: 32px; font-weight: bold; background: #f8fafc; padding: 24px; border-radius: 12px; display: inline-block; border: 1px solid #f1f5f9; letter-spacing: 0.1em;">
          ${verificationCode}
        </div>
      </div>`
    );

    logger.info(`Verification code for ${email}: ${verificationCode}`);

    return { 
      email,
      verificationRequired: true,
      message: 'Verification code sent to email'
    };
  }

  /**
   * Complete registration after verification
   */
  async completeRegistration(email, code) {
    const pending = await PendingUser.findOne({ email });

    if (!pending) {
      throw { status: 404, message: 'Registration session expired or not found' };
    }

    if (pending.verificationCode !== code) {
      throw { status: 400, message: 'Invalid verification code' };
    }

    // Create the actual user
    const user = new User({
      firstName: pending.firstName,
      lastName: pending.lastName,
      email: pending.email,
      password: pending.password,
      phoneNumber: pending.phoneNumber,
      profileImage: pending.profileImage,
      role: pending.role,
      stream: pending.stream,
      gradeLevel: pending.role === 'student' ? null : pending.gradeLevel,
      status: 'active',
      isEmailVerified: true,
    });

    await user.save();
    await PendingUser.deleteOne({ _id: pending._id });

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
    logger.info(`Password reset requested for: ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn(`Password reset attempt for non-existent email: ${email}`);
      // Always return a generic response to avoid account enumeration.
      return { message: 'If any account exists for this email, a reset link will be sent.' };
    }

    logger.info(`User found for reset: ${user._id} (${user.email})`);

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
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f8fafc; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); overflow: hidden;">
          <tr>
            <td style="padding: 40px 48px; text-align: center; border-bottom: 1px solid #f1f5f9; background-color: #ffffff;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #0f172a; letter-spacing: -0.025em;">Entrance Exam Prep</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 48px;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #334155;">Hello <strong style="color: #0f172a;">${user.firstName}</strong>,</p>
              <p style="margin: 0 0 32px; font-size: 16px; line-height: 24px; color: #334155;">We received a request to reset your password for Entrance Exam Prep. Click the button below to continue.</p>
              
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center" style="padding-bottom: 32px;">
                    <a href="${resetLink}" style="display: inline-block; padding: 16px 32px; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Reset Password</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 16px; font-size: 14px; line-height: 24px; color: #64748b;">Or copy and paste this link into your browser:</p>
              <p style="margin: 0 0 32px; font-size: 14px; line-height: 24px; color: #2563eb; word-break: break-all;"><a href="${resetLink}" style="color: #2563eb; text-decoration: underline;">${resetLink}</a></p>
              
              <div style="background-color: #fff8f1; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 32px; border-radius: 4px 8px 8px 4px;">
                <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 500;"><strong>Security Notice:</strong> This link will expire in 10 minutes. If you did not request a password reset, you can safely ignore this email. Your account remains secure.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 48px; background-color: #f8fafc; text-align: center; border-top: 1px solid #f1f5f9;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #94a3b8;">&copy; ${new Date().getFullYear()} Entrance Exam Prep. All rights reserved.</p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">This is an automated message. Please do not reply directly to this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
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
    const allowedFields = ['firstName', 'lastName', 'phoneNumber', 'profileImage', 'stream'];
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

  async getAiSettings(userId) {
    const user = await User.findById(userId).select('role geminiApiKeyLast4 geminiApiKeyUpdatedAt');
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }
    if (user.role !== 'student') {
      throw { status: 403, message: 'AI settings are only available for students' };
    }

    return {
      hasGeminiApiKey: Boolean(user.geminiApiKeyLast4),
      geminiApiKeyLast4: user.geminiApiKeyLast4,
      geminiApiKeyUpdatedAt: user.geminiApiKeyUpdatedAt,
    };
  }

  async updateGeminiApiKey(userId, apiKey) {
    const trimmed = typeof apiKey === 'string' ? apiKey.trim() : '';
    if (!trimmed) {
      throw { status: 400, message: 'Gemini API key is required' };
    }
    if (trimmed.length < 20) {
      throw { status: 400, message: 'Gemini API key looks too short' };
    }

    const user = await User.findById(userId).select('+geminiApiKeyEncrypted role');
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }
    if (user.role !== 'student') {
      throw { status: 403, message: 'Only students can save a Gemini API key' };
    }

    user.geminiApiKeyEncrypted = this.encryptGeminiApiKey(trimmed);
    user.geminiApiKeyLast4 = trimmed.slice(-4);
    user.geminiApiKeyUpdatedAt = new Date();
    await user.save();

    return this.getAiSettings(userId);
  }

  async removeGeminiApiKey(userId) {
    const user = await User.findById(userId).select('+geminiApiKeyEncrypted role');
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }
    if (user.role !== 'student') {
      throw { status: 403, message: 'Only students can remove a Gemini API key' };
    }

    user.geminiApiKeyEncrypted = null;
    user.geminiApiKeyLast4 = null;
    user.geminiApiKeyUpdatedAt = null;
    await user.save();

    return this.getAiSettings(userId);
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
      stream: user.stream,
      gradeLevel: user.gradeLevel,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}

module.exports = new AuthService();
