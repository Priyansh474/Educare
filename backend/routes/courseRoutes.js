const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { requireInstructor, requireAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Protected routes - Instructors and Admins can create/update courses
// Admins have full authority to add, edit, and delete any course
router.post('/', requireInstructor, createCourse); // Admin or Instructor can create
router.put('/:id', requireInstructor, updateCourse); // Admin can edit any course, Instructor can edit their own

// Admin-only routes - Only admins can delete courses
router.delete('/:id', requireAdmin, deleteCourse);

module.exports = router;
