/**
 * Role-Based Access Control Middleware
 * Provides flexible role checking for routes
 */

const authMiddleware = require('./authMiddleware');

/**
 * Middleware to check if user has required role(s)
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 * @returns {Function} Express middleware function
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // First verify authentication
    authMiddleware(req, res, () => {
      // Check if user has required role
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        });
      }

      next();
    });
  };
};

/**
 * Middleware to check if user is admin
 */
const requireAdmin = requireRole('admin');

/**
 * Middleware to check if user is instructor or admin
 */
const requireInstructor = requireRole('instructor', 'admin');

/**
 * Middleware to check if user is student, instructor, or admin
 * (Essentially any authenticated user)
 */
const requireAuth = authMiddleware;

/**
 * Middleware to check if user owns the resource or is admin
 * @param {Function} getResourceOwnerId - Function to get owner ID from request
 * @returns {Function} Express middleware function
 */
const requireOwnershipOrAdmin = (getResourceOwnerId) => {
  return (req, res, next) => {
    authMiddleware(req, res, async () => {
      try {
        const ownerId = await getResourceOwnerId(req);
        const userId = req.user.id;
        const userRole = req.user.role;

        // Admin can access anything
        if (userRole === 'admin') {
          return next();
        }

        // Check if user owns the resource
        if (ownerId && ownerId.toString() === userId.toString()) {
          return next();
        }

        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own resources.',
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'Error checking resource ownership',
        });
      }
    });
  };
};

module.exports = {
  requireRole,
  requireAdmin,
  requireInstructor,
  requireAuth,
  requireOwnershipOrAdmin,
};
