/**
 * Input Validation Utilities
 * Provides reusable validation functions
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
function validatePassword(password) {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long',
    };
  }

  if (password.length > 128) {
    return {
      isValid: false,
      message: 'Password must be less than 128 characters',
    };
  }

  return {
    isValid: true,
    message: 'Password is valid',
  };
}

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {Object} Validation result
 */
function validateName(name) {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      message: 'Name is required',
    };
  }

  if (name.length > 100) {
    return {
      isValid: false,
      message: 'Name must be less than 100 characters',
    };
  }

  return {
    isValid: true,
    message: 'Name is valid',
  };
}

/**
 * Sanitize string input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeString(input) {
  if (typeof input !== 'string') {
    return '';
  }
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate role
 * @param {string} role - Role to validate
 * @returns {boolean} True if valid role
 */
function isValidRole(role) {
  const validRoles = ['student', 'instructor', 'admin'];
  return validRoles.includes(role);
}

module.exports = {
  isValidEmail,
  validatePassword,
  validateName,
  sanitizeString,
  isValidRole,
};
