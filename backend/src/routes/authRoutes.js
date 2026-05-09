const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  requestPasswordResetValidation,
  resetPasswordValidation,
  updateProfileValidation,
  changePasswordValidation,
} = require('../middleware/authValidation');
const { profileImageUpload } = require('../middleware/upload');

const router = express.Router();

/**
 * Public Routes (No Authentication Required)
 */

/**
 * POST /api/auth/register
 * Register a new user (student, teacher, or admin)
 * FR-01: System shall allow students, teachers, and administrators to create user accounts
 *
 * Request Body:
 * {
 *   "firstName": "string (required)",
 *   "lastName": "string (required)",
 *   "email": "string (required, unique)",
 *   "password": "string (required, min 6 chars, must have uppercase, lowercase, digit)",
 *   "phoneNumber": "string (optional)",
 *   "role": "enum [student, teacher, admin] (optional, default: student)",
 *   "profileImage": "string URL (optional)"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "User registered successfully",
 *   "data": {
 *     "user": { ... },
 *     "token": "JWT token"
 *   }
 * }
 */
router.post('/register', profileImageUpload.single('profileImageFile'), registerValidation, authController.register);

/**
 * POST /api/auth/login
 * Login user with email and password
 * FR-04: System shall allow users to log in
 *
 * Request Body:
 * {
 *   "email": "string (required)",
 *   "password": "string (required)"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "data": {
 *     "user": { ... },
 *     "token": "JWT token"
 *   }
 * }
 */
const loginRateLimiter = require('../middleware/loginRateLimiter');

router.post('/login', loginValidation, loginRateLimiter, authController.login);

/**
 * POST /api/auth/request-password-reset
 * Request password reset
 * FR-05: System shall allow users to reset passwords
 *
 * Request Body:
 * {
 *   "email": "string (required)"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Password reset request processed",
 *   "data": {
 *     "message": "If email exists, reset link will be sent",
 *     "resetToken": "token (for testing only)",
 *     "expiresIn": "30 minutes"
 *   }
 * }
 */
router.post('/request-password-reset', requestPasswordResetValidation, authController.requestPasswordReset);

/**
 * POST /api/auth/reset-password
 * Reset password with token
 *
 * Request Body:
 * {
 *   "resetToken": "string (required)",
 *   "newPassword": "string (required, min 6 chars)"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Password reset successful",
 *   "data": { ... }
 * }
 */
router.post('/reset-password', resetPasswordValidation, authController.resetPassword);

/**
 * POST /api/auth/verify-email
 * Verify email with token
 */
router.post('/verify-email', authController.verifyEmail);

/**
 * Protected Routes (Authentication Required)
 */

/**
 * GET /api/auth/profile
 * Get current user profile
 *
 * Headers:
 * {
 *   "Authorization": "Bearer <JWT token>"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Profile retrieved successfully",
 *   "data": { ... user object ... }
 * }
 */
router.get('/profile', authenticate, authController.getProfile);

/**
 * PUT /api/auth/profile
 * Update user profile
 *
 * Headers:
 * {
 *   "Authorization": "Bearer <JWT token>"
 * }
 *
 * Request Body:
 * {
 *   "firstName": "string (optional)",
 *   "lastName": "string (optional)",
 *   "phoneNumber": "string (optional)",
 *   "profileImage": "string URL (optional)"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Profile updated successfully",
 *   "data": { ... updated user ... }
 * }
 */
router.put('/profile', authenticate, profileImageUpload.single('profileImageFile'), updateProfileValidation, authController.updateProfile);

router.get('/ai-settings', authenticate, authController.getAiSettings);

/**
 * POST /api/auth/change-password
 * Change password (requires current password verification)
 * FR-05: System shall allow users to change passwords
 *
 * Headers:
 * {
 *   "Authorization": "Bearer <JWT token>"
 * }
 *
 * Request Body:
 * {
 *   "oldPassword": "string (required)",
 *   "newPassword": "string (required, min 6 chars)"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Password changed successfully",
 *   "data": { ... }
 * }
 */
router.post('/change-password', authenticate, changePasswordValidation, authController.changePassword);

/**
 * POST /api/auth/logout
 * Logout user and blacklist JWT token
 * FR-04: System shall provide a logout option
 *
 * Headers:
 * {
 *   "Authorization": "Bearer <JWT token>"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Logout successful",
 *   "data": { ... }
 * }
 */
router.post('/logout', authenticate, authController.logout);

module.exports = router;
