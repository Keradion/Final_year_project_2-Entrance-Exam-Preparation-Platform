const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const { getRedisClient } = require('../config/redis');

class AuthController {
  /**
   * POST /api/auth/register
   * Register a new user (student, teacher, or admin)
   * FR-01: System shall allow students, teachers, and administrators to create user accounts
   */
  async register(req, res, next) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        role,
        profileImage,
        stream,
      } = req.body || {};
      const uploadedProfileImage = req.file
        ? `${req.protocol}://${req.get('host')}/uploads/profiles/${req.file.filename}`
        : undefined;

      const result = await authService.registerUser({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        role,
        stream,
        profileImage: uploadedProfileImage || profileImage,
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Login user with email and password
   * FR-04: System shall allow users to log in
   */
  async login(req, res, next) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;

      const result = await authService.loginUser(email, password);

      // Reset failed attempts on successful login
      const redisClient = getRedisClient();
      if (redisClient) {
        await redisClient.del(`login_attempts:${email}`);
      }

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      // Increment failed attempts on error (only if it's an authentication error)
      if (error.status === 401) {
        const { email } = req.body;
        const redisClient = getRedisClient();
        if (redisClient && email) {
          const key = `login_attempts:${email}`;
          try {
            const attempts = await redisClient.incr(key);
            if (attempts === 1) {
              await redisClient.expire(key, 30);
            }
          } catch (redisErr) {
            console.error('Redis error during rate limiting:', redisErr);
          }
        }
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/request-password-reset
   * Request password reset
   * FR-05: System shall allow users to reset passwords
   */
  async requestPasswordReset(req, res, next) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email } = req.body;

      const result = await authService.requestPasswordReset(email);

      res.status(200).json({
        success: true,
        message: 'If any account exists for this email, a reset link will be sent.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/reset-password
   * Reset password with token
   */
  async resetPassword(req, res, next) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { resetToken, newPassword } = req.body;

      const result = await authService.resetPassword(resetToken, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password reset successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/verify-email
   * Complete registration after verifying 6-digit code
   */
  async verifyEmail(req, res, next) {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return res.status(400).json({
          success: false,
          message: 'Email and verification code are required',
        });
      }

      const result = await authService.completeRegistration(email, code);

      res.status(200).json({
        success: true,
        message: 'Registration completed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }


  /**
   * GET /api/auth/profile
   * Get current user profile (requires authentication)
   */
  async getProfile(req, res, next) {
    try {
      const user = authService.formatUserResponse(req.user);

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/auth/profile
   * Update user profile (requires authentication)
   */
  async updateProfile(req, res, next) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const userId = req.user?.id || req.user?._id?.toString() || req.user?._id;
      const { firstName, lastName, phoneNumber, profileImage, stream } = req.body || {};
      const uploadedProfileImage = req.file
        ? `${req.protocol}://${req.get('host')}/uploads/profiles/${req.file.filename}`
        : undefined;

      const user = await authService.updateProfile(userId, {
        firstName,
        lastName,
        phoneNumber,
        stream,
        profileImage: uploadedProfileImage || profileImage,
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/change-password
   * Change password (requires authentication)
   * FR-05: System shall allow users to reset/change passwords
   */
  async changePassword(req, res, next) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const userId = req.user?.id || req.user?._id?.toString() || req.user?._id;
      const { oldPassword, newPassword } = req.body;

      const result = await authService.changePassword(userId, oldPassword, newPassword);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Logout user and blacklist token
   * FR-04: System shall provide a logout option
   */
  async logout(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Authorization token is missing',
        });
      }

      const token = authHeader.substring(7); // Remove "Bearer " prefix
      const result = await authService.logoutUser(token);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
