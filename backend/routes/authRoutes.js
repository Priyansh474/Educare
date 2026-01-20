const express = require('express');
const {
  signup,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe,
  logout,
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/roleMiddleware');
const { authRateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes with rate limiting
router.post('/signup', authRateLimiter, signup);
router.post('/login', authRateLimiter, login);
router.post('/refresh', authRateLimiter, refreshToken);
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password', authRateLimiter, resetPassword);

// Protected routes
router.get('/me', requireAuth, getMe);
router.post('/logout', requireAuth, logout);

module.exports = router;
