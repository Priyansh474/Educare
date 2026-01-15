const express = require('express');
const {
  enrollCourse,
  getUserEnrollments,
  updateProgress,
  getAllEnrollments,
} = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/', authMiddleware, enrollCourse);
router.get('/me', authMiddleware, getUserEnrollments);
router.put('/:id/progress', authMiddleware, updateProgress);
router.get('/', adminMiddleware, getAllEnrollments);

module.exports = router;
