const express = require('express');
const {
  enrollCourse,
  getUserEnrollments,
  updateProgress,
  getAllEnrollments,
  getCourseEnrollments,
} = require('../controllers/enrollmentController');
const { requireAuth, requireAdmin, requireInstructor } = require('../middleware/roleMiddleware');

const router = express.Router();

// Admin-only routes - must come first to avoid route conflicts
router.get('/all', requireAdmin, getAllEnrollments);

// Instructor/Admin routes - must come after admin routes to avoid route conflicts
router.get('/course/:courseId', requireInstructor, getCourseEnrollments);

// Student routes
router.post('/', requireAuth, enrollCourse);
router.get('/me', requireAuth, getUserEnrollments);
router.put('/:id/progress', requireAuth, updateProgress);

module.exports = router;
