/**
 * Helper functions for common operations
 */

const crypto = require('crypto');

/**
 * Generate a random token
 * @param {number} length - Token length in bytes
 * @returns {string} Random token
 */
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with details
 */
function validatePasswordStrength(password) {
  const result = {
    isValid: true,
    errors: [],
  };

  if (password.length < 8) {
    result.errors.push('Password must be at least 8 characters long');
    result.isValid = false;
  }

  if (!/[A-Z]/.test(password)) {
    result.errors.push('Password must contain at least one uppercase letter');
    result.isValid = false;
  }

  if (!/[a-z]/.test(password)) {
    result.errors.push('Password must contain at least one lowercase letter');
    result.isValid = false;
  }

  if (!/[0-9]/.test(password)) {
    result.errors.push('Password must contain at least one number');
    result.isValid = false;
  }

  if (!/[!@#$%^&*]/.test(password)) {
    result.errors.push('Password must contain at least one special character (!@#$%^&*)');
    result.isValid = false;
  }

  return result;
}

/**
 * Calculate percentage progress
 * @param {number} completed - Number of completed items
 * @param {number} total - Total number of items
 * @returns {number} Percentage (0-100)
 */
function calculateProgress(completed, total) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Get milestone status
 * @param {number} percentage - Progress percentage
 * @returns {array} Array of reached milestones
 */
function getMilestones(percentage) {
  const milestones = [];
  if (percentage >= 25) milestones.push(25);
  if (percentage >= 50) milestones.push(50);
  if (percentage >= 75) milestones.push(75);
  if (percentage >= 100) milestones.push(100);
  return milestones;
}

/**
 * Paginate array
 * @param {array} array - Array to paginate
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {object} Paginated result with metadata
 */
function paginate(array, page = 1, limit = 10) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      totalItems: array.length,
      totalPages: Math.ceil(array.length / limit),
      currentPage: page,
      itemsPerPage: limit,
    },
  };
}

/**
 * Format date for API response
 * @param {Date} date - Date to format
 * @returns {string} ISO string
 */
function formatDate(date) {
  return date ? new Date(date).toISOString() : null;
}

module.exports = {
  generateToken,
  isValidEmail,
  validatePasswordStrength,
  calculateProgress,
  getMilestones,
  paginate,
  formatDate,
};
