/**
 * Rate Limiting Middleware
 * Protects authentication endpoints from brute force attacks
 */

// Simple in-memory rate limiter (for production, use Redis)
const rateLimitStore = new Map();

/**
 * Clear old entries from rate limit store
 */
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.expiresAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

// Cleanup every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);

/**
 * Rate limiter middleware
 * @param {Object} options - Rate limit options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum number of requests per window
 * @param {string} options.message - Error message
 * @returns {Function} Express middleware
 */
function rateLimiter({ windowMs = 15 * 60 * 1000, max = 5, message = 'Too many requests, please try again later' }) {
  return (req, res, next) => {
    // Get identifier (IP address or user ID)
    const identifier = req.ip || req.connection.remoteAddress;
    const key = `${req.path}:${identifier}`;
    const now = Date.now();

    // Get or create rate limit entry
    let entry = rateLimitStore.get(key);

    if (!entry || entry.expiresAt < now) {
      // Create new entry
      entry = {
        count: 1,
        expiresAt: now + windowMs,
      };
      rateLimitStore.set(key, entry);
      return next();
    }

    // Increment count
    entry.count += 1;

    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.expiresAt - now) / 1000);
      return res.status(429).json({
        success: false,
        message,
        retryAfter, // Seconds until they can try again
      });
    }

    rateLimitStore.set(key, entry);
    next();
  };
}

/**
 * Strict rate limiter for authentication endpoints
 * In development, we disable the limit so you can log in freely while testing.
 */
const authRateLimiter =
  process.env.NODE_ENV === 'development'
    ? (req, res, next) => next()
    : rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // 5 requests per 15 minutes
        message: 'Too many authentication attempts, please try again later',
      });

/**
 * General API rate limiter
 */
const apiRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: 'Too many requests, please slow down',
});

module.exports = {
  rateLimiter,
  authRateLimiter,
  apiRateLimiter,
};
