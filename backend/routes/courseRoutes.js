const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/', adminMiddleware, createCourse);
router.put('/:id', adminMiddleware, updateCourse);
router.delete('/:id', adminMiddleware, deleteCourse);

module.exports = router;
