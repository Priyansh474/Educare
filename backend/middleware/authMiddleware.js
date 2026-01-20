const { verifyAccessToken } = require('../utils/tokenService');
const { createErrorResponse } = require('../utils/errors');

/**
 * Authentication Middleware
 * Verifies JWT access token and attaches user info to request
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const errorResponse = createErrorResponse('No token provided, authorization denied', 401);
      return res.status(401).json(errorResponse);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      const errorResponse = createErrorResponse('No token provided, authorization denied', 401);
      return res.status(401).json(errorResponse);
    }

    // Verify token using token service
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    let message = 'Token is not valid';
    if (error.name === 'TokenExpiredError') {
      message = 'Token has expired';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Invalid token';
    }

    const errorResponse = createErrorResponse(message, 401);
    res.status(401).json(errorResponse);
  }
};

module.exports = authMiddleware;
