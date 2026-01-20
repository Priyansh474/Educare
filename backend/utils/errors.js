/**
 * Error Handling Utilities
 * Provides consistent error response formatting
 */

/**
 * Create standardized error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Array} errors - Array of field-specific errors
 * @returns {Object} Error response object
 */
function createErrorResponse(message, statusCode = 400, errors = []) {
  return {
    success: false,
    message,
    errors,
    statusCode,
  };
}

/**
 * Create success response
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Success response object
 */
function createSuccessResponse(message, data = null, statusCode = 200) {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return { response, statusCode };
}

/**
 * Handle async errors in route handlers
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped function with error handling
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  createErrorResponse,
  createSuccessResponse,
  asyncHandler,
};
