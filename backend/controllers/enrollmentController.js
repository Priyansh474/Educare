const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const { createErrorResponse, createSuccessResponse, asyncHandler } = require('../utils/errors');

// @desc    Enroll user in course
// @route   POST /api/enrollments
// @access  Private/Student
const enrollCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  // Validate input
  if (!courseId) {
    const errorResponse = createErrorResponse('Course ID is required', 400);
    return res.status(400).json(errorResponse);
  }

  // Check if user is a student (or allow instructors/admins to enroll for testing)
  if (req.user.role !== 'student' && req.user.role !== 'instructor' && req.user.role !== 'admin') {
    const errorResponse = createErrorResponse('Only students can enroll in courses', 403);
    return res.status(403).json(errorResponse);
  }

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    const errorResponse = createErrorResponse('Course not found', 404);
    return res.status(404).json(errorResponse);
  }

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({ userId, courseId });
  if (existingEnrollment) {
    const errorResponse = createErrorResponse('Already enrolled in this course', 400);
    return res.status(400).json(errorResponse);
  }

  // Create enrollment
  const enrollment = await Enrollment.create({
    userId,
    courseId,
    progress: new Map(),
    progressPercentage: 0,
  });

  // Populate course details
  await enrollment.populate('courseId', 'title slug description price category difficulty thumbnailUrl instructor');

  const { response, statusCode } = createSuccessResponse('Enrolled in course successfully', { enrollment }, 201);
  res.status(statusCode).json(response);
});

// @desc    Get user's enrollments
// @route   GET /api/enrollments/me
// @access  Private
const getUserEnrollments = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const enrollments = await Enrollment.find({ userId })
    .populate({
      path: 'courseId',
      select: 'title slug description price category difficulty thumbnailUrl instructor lessons',
    })
    .sort({ enrolledAt: -1 });

  const { response, statusCode } = createSuccessResponse('Enrollments retrieved successfully', {
    count: enrollments.length,
    enrollments,
  });

  res.status(statusCode).json(response);
});

// @desc    Update progress for lesson
// @route   PUT /api/enrollments/:id/progress
// @access  Private
const updateProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { lessonId, completed } = req.body;
  const userId = req.user.id;

  // Validate input
  if (!lessonId) {
    const errorResponse = createErrorResponse('Lesson ID is required', 400);
    return res.status(400).json(errorResponse);
  }

  if (completed === undefined || typeof completed !== 'boolean') {
    const errorResponse = createErrorResponse('Completed status (boolean) is required', 400);
    return res.status(400).json(errorResponse);
  }

  // Find enrollment and verify ownership
  const enrollment = await Enrollment.findById(id).populate('courseId');
  if (!enrollment) {
    const errorResponse = createErrorResponse('Enrollment not found', 404);
    return res.status(404).json(errorResponse);
  }

  if (enrollment.userId.toString() !== userId) {
    const errorResponse = createErrorResponse('Not authorized to update this enrollment', 403);
    return res.status(403).json(errorResponse);
  }

  // Verify lesson exists in course
  const course = enrollment.courseId;
  const lessonExists = course.lessons.some((lesson) => lesson._id.toString() === lessonId);
  if (!lessonExists) {
    const errorResponse = createErrorResponse('Lesson not found in this course', 404);
    return res.status(404).json(errorResponse);
  }

  // Update progress
  enrollment.progress.set(lessonId, completed);

  // Calculate progress percentage
  const totalLessons = course.lessons.length;
  const completedLessons = Array.from(enrollment.progress.values()).filter(Boolean).length;
  enrollment.progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Mark as completed if all lessons done
  if (enrollment.progressPercentage === 100 && !enrollment.completedAt) {
    enrollment.completedAt = new Date();
  } else if (enrollment.progressPercentage < 100 && enrollment.completedAt) {
    // Reset completedAt if progress drops below 100%
    enrollment.completedAt = null;
  }

  await enrollment.save();

  // Populate course details
  await enrollment.populate('courseId', 'title slug description price category difficulty thumbnailUrl instructor');

  const { response, statusCode } = createSuccessResponse('Progress updated successfully', { enrollment });
  res.status(statusCode).json(response);
});

// @desc    Get all enrollments (admin)
// @route   GET /api/enrollments/all
// @access  Private/Admin
const getAllEnrollments = asyncHandler(async (req, res) => {
  const { courseId, userId } = req.query;

  // Build filter
  const filter = {};
  if (courseId) filter.courseId = courseId;
  if (userId) filter.userId = userId;

  const enrollments = await Enrollment.find(filter)
    .populate('userId', 'name email role')
    .populate('courseId', 'title slug category difficulty')
    .sort({ enrolledAt: -1 });

  const { response, statusCode } = createSuccessResponse('Enrollments retrieved successfully', {
    count: enrollments.length,
    enrollments,
  });

  res.status(statusCode).json(response);
});

// @desc    Get enrollments for a specific course (instructor/admin)
// @route   GET /api/enrollments/course/:courseId
// @access  Private/Instructor/Admin
const getCourseEnrollments = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    const errorResponse = createErrorResponse('Course not found', 404);
    return res.status(404).json(errorResponse);
  }

  // Check authorization: instructors can only see enrollments for their own courses
  if (userRole === 'instructor' && course.instructorId && course.instructorId.toString() !== userId) {
    const errorResponse = createErrorResponse('Not authorized to view enrollments for this course', 403);
    return res.status(403).json(errorResponse);
  }

  const enrollments = await Enrollment.find({ courseId })
    .populate('userId', 'name email role')
    .sort({ enrolledAt: -1 });

  const { response, statusCode } = createSuccessResponse('Course enrollments retrieved successfully', {
    course: {
      id: course._id,
      title: course.title,
    },
    count: enrollments.length,
    enrollments,
  });

  res.status(statusCode).json(response);
});

module.exports = {
  enrollCourse,
  getUserEnrollments,
  updateProgress,
  getAllEnrollments,
  getCourseEnrollments,
};
