const { User } = require('../models');
const authService = require('../services/authService');
const { getRedisClient } = require('../config/redis');

/**
 * JWT Authentication Middleware
 * Verifies the JWT token from the Authorization header, checks if it has been
 * blacklisted (logged out), and attaches the user's data to the request object.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token is missing or malformed.',
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Check if token is in the blacklist (meaning the user has logged out)
    const redis = getRedisClient();
    if (redis) {
      const isBlacklisted = await redis.get(`token_blacklist:${token}`);
      if (isBlacklisted) {
        return res.status(401).json({
          success: false,
          message: 'Token has been revoked. Please log in again.',
        });
      }
    }

    // Verify the token's signature and expiration
    const decoded = authService.verifyToken(token);

    // Attach the full user object to the request for use in subsequent middleware/controllers
    const user = await User.findById(decoded.id).lean(); // .lean() returns a plain JS object, which is faster
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active.',
      });
    }

    req.user = user; // Now req.user contains the full user profile

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid or expired token.',
    });
  }
};

/**
 * ==================================================================================
 * Role-Based Authorization Middleware
 * ==================================================================================
 *
 * These are higher-order functions that return middleware. They check the role of the
 * authenticated user (attached by the `authenticate` middleware) and grant or deny access.
 *
 * Why use this pattern?
 * - Readability: `router.post('/', authenticate, isAdmin, ...)` is much clearer than
 *   `router.post('/', authenticate, authorize('admin'), ...)`.
 * - Maintainability: If the logic for role checks changes, you only need to update it
 *   in one place.
 *
 * ==================================================================================
 */

/**
 * Generic authorization middleware factory.
 * @param {...string} roles - A list of roles that are allowed access.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // This middleware assumes `authenticate` has already run and attached req.user
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access Forbidden. You must have one of the following roles: ${roles.join(', ')}.`,
      });
    }

    next();
  };
};

/**
 * Middleware to check if the user is an administrator.
 */
const isAdmin = authorize('admin');

/**
 * Middleware to check if the user is a teacher.
 */
const isTeacher = authorize('teacher');

/**
 * Middleware to check if the user is either a teacher or an administrator.
 */
const isTeacherOrAdmin = authorize('teacher', 'admin');

module.exports = {
  protect: authenticate,
  authenticate,
  authorize,
  isAdmin,
  isTeacher,
  isTeacherOrAdmin,
};

