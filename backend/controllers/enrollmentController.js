const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Enroll user in course
// @route   POST /api/enroll
// @access  Private
const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ message: 'Please provide courseId' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      userId,
      courseId,
      progress: new Map(),
      progressPercentage: 0,
    });

    res.status(201).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's enrollments
// @route   GET /api/enrollments/me
// @access  Private
const getUserEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await Enrollment.find({ userId })
      .populate({
        path: 'courseId',
        select: 'title slug description price category difficulty thumbnailUrl instructor',
      })
      .sort({ enrolledAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update progress for lesson
// @route   PUT /api/enrollments/:id/progress
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { lessonId, completed } = req.body;
    const userId = req.user.id;

    if (!lessonId || completed === undefined) {
      return res.status(400).json({ message: 'Please provide lessonId and completed status' });
    }

    // Find enrollment and verify ownership
    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this enrollment' });
    }

    // Update progress
    enrollment.progress.set(lessonId, completed);

    // Calculate progress percentage
    const course = await Course.findById(enrollment.courseId);
    const totalLessons = course.lessons.length;
    const completedLessons = Array.from(enrollment.progress.values()).filter(Boolean).length;
    enrollment.progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Mark as completed if all lessons done
    if (enrollment.progressPercentage === 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all enrollments (admin)
// @route   GET /api/enrollments
// @access  Private/Admin
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('userId', 'name email')
      .populate('courseId', 'title');

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  enrollCourse,
  getUserEnrollments,
  updateProgress,
  getAllEnrollments,
};
