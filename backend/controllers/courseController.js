const mongoose = require('mongoose');
const Course = require('../models/Course');
const { createErrorResponse, createSuccessResponse, asyncHandler } = require('../utils/errors');
const { sanitizeString } = require('../utils/validators');

// @desc    Get all courses with filters
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const { category, difficulty, search, page = 1, limit = 10 } = req.query;

  // Build filter object
  const filter = {};
  if (category) {
    const validCategories = ['programming', 'design', 'business', 'marketing', 'data-science', 'other'];
    if (validCategories.includes(category)) {
      filter.category = category;
    }
  }
  if (difficulty) {
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    if (validDifficulties.includes(difficulty)) {
      filter.difficulty = difficulty;
    }
  }
  if (search) {
    const sanitizedSearch = sanitizeString(search);
    if (sanitizedSearch.length > 0) {
      filter.$or = [
        { title: { $regex: sanitizedSearch, $options: 'i' } },
        { description: { $regex: sanitizedSearch, $options: 'i' } },
      ];
    }
  }

  // Validate pagination
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10)); // Max 50 per page

  // Execute query with pagination
  const skip = (pageNum - 1) * limitNum;
  const courses = await Course.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 });
  const total = await Course.countDocuments(filter);

  const { response, statusCode } = createSuccessResponse('Courses retrieved successfully', {
    count: courses.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    courses,
  });

  res.status(statusCode).json(response);
});

// @desc    Get single course by ID or slug
// @route   GET /api/courses/:id
// @access  Public
const getCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    const errorResponse = createErrorResponse('Course ID is required', 400);
    return res.status(400).json(errorResponse);
  }

  // Check if id is a valid ObjectId, otherwise treat it as a slug
  let course;
  if (mongoose.Types.ObjectId.isValid(id)) {
    course = await Course.findById(id);
  }
  
  // If not found by ID or ID is invalid, try finding by slug
  if (!course) {
    course = await Course.findOne({ slug: id });
  }

  if (!course) {
    const errorResponse = createErrorResponse('Course not found', 404);
    return res.status(404).json(errorResponse);
  }

  const { response, statusCode } = createSuccessResponse('Course retrieved successfully', { course });
  res.status(statusCode).json(response);
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Instructor/Admin
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, price, category, difficulty, instructor, thumbnailUrl, lessons = [] } = req.body;

  // Validate required fields
  const errors = [];

  if (!title || !title.trim()) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (title.length > 200) {
    errors.push({ field: 'title', message: 'Title must be less than 200 characters' });
  }

  if (!description || !description.trim()) {
    errors.push({ field: 'description', message: 'Description is required' });
  }

  if (price === undefined || price === null) {
    errors.push({ field: 'price', message: 'Price is required' });
  } else if (typeof price !== 'number' || price < 0) {
    errors.push({ field: 'price', message: 'Price must be a non-negative number' });
  }

  if (!category) {
    errors.push({ field: 'category', message: 'Category is required' });
  } else {
    const validCategories = ['programming', 'design', 'business', 'marketing', 'data-science', 'other'];
    if (!validCategories.includes(category)) {
      errors.push({ field: 'category', message: `Category must be one of: ${validCategories.join(', ')}` });
    }
  }

  if (!difficulty) {
    errors.push({ field: 'difficulty', message: 'Difficulty is required' });
  } else {
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    if (!validDifficulties.includes(difficulty)) {
      errors.push({ field: 'difficulty', message: `Difficulty must be one of: ${validDifficulties.join(', ')}` });
    }
  }

  if (!instructor || !instructor.trim()) {
    errors.push({ field: 'instructor', message: 'Instructor name is required' });
  }

  // Validate lessons
  if (Array.isArray(lessons)) {
    lessons.forEach((lesson, index) => {
      if (!lesson.title || !lesson.title.trim()) {
        errors.push({ field: `lessons[${index}].title`, message: 'Lesson title is required' });
      }
      if (lesson.order !== undefined && (typeof lesson.order !== 'number' || lesson.order < 1)) {
        errors.push({ field: `lessons[${index}].order`, message: 'Lesson order must be a positive number' });
      }
    });
  }

  if (errors.length > 0) {
    const errorResponse = createErrorResponse('Validation failed', 400, errors);
    return res.status(400).json(errorResponse);
  }

  // Create course
  const course = await Course.create({
    title: sanitizeString(title),
    description: sanitizeString(description),
    price: parseFloat(price),
    category,
    difficulty,
    instructor: sanitizeString(instructor),
    thumbnailUrl: thumbnailUrl || null,
    lessons: lessons.map((lesson, index) => ({
      title: sanitizeString(lesson.title),
      contentHtml: lesson.contentHtml || '',
      videoUrl: lesson.videoUrl || null,
      order: lesson.order || index + 1,
    })),
    instructorId: req.user.role === 'instructor' ? req.user.id : undefined,
  });

  const { response, statusCode } = createSuccessResponse('Course created successfully', { course }, 201);
  res.status(statusCode).json(response);
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Instructor/Admin
const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, price, category, difficulty, instructor, thumbnailUrl, lessons } = req.body;

  let course = await Course.findById(id);
  if (!course) {
    const errorResponse = createErrorResponse('Course not found', 404);
    return res.status(404).json(errorResponse);
  }

  // Check ownership (instructors can only edit their own courses, admins can edit any)
  if (req.user.role === 'instructor' && course.instructorId && course.instructorId.toString() !== req.user.id) {
    const errorResponse = createErrorResponse('Not authorized to update this course', 403);
    return res.status(403).json(errorResponse);
  }

  // Validate and update fields
  const errors = [];

  if (title !== undefined) {
    if (!title || !title.trim()) {
      errors.push({ field: 'title', message: 'Title cannot be empty' });
    } else if (title.length > 200) {
      errors.push({ field: 'title', message: 'Title must be less than 200 characters' });
    } else {
      course.title = sanitizeString(title);
    }
  }

  if (description !== undefined) {
    if (!description || !description.trim()) {
      errors.push({ field: 'description', message: 'Description cannot be empty' });
    } else {
      course.description = sanitizeString(description);
    }
  }

  if (price !== undefined) {
    if (typeof price !== 'number' || price < 0) {
      errors.push({ field: 'price', message: 'Price must be a non-negative number' });
    } else {
      course.price = price;
    }
  }

  if (category !== undefined) {
    const validCategories = ['programming', 'design', 'business', 'marketing', 'data-science', 'other'];
    if (!validCategories.includes(category)) {
      errors.push({ field: 'category', message: `Category must be one of: ${validCategories.join(', ')}` });
    } else {
      course.category = category;
    }
  }

  if (difficulty !== undefined) {
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    if (!validDifficulties.includes(difficulty)) {
      errors.push({ field: 'difficulty', message: `Difficulty must be one of: ${validDifficulties.join(', ')}` });
    } else {
      course.difficulty = difficulty;
    }
  }

  if (instructor !== undefined) {
    if (!instructor || !instructor.trim()) {
      errors.push({ field: 'instructor', message: 'Instructor name cannot be empty' });
    } else {
      course.instructor = sanitizeString(instructor);
    }
  }

  if (thumbnailUrl !== undefined) {
    course.thumbnailUrl = thumbnailUrl || null;
  }

  if (lessons !== undefined) {
    if (!Array.isArray(lessons)) {
      errors.push({ field: 'lessons', message: 'Lessons must be an array' });
    } else {
      lessons.forEach((lesson, index) => {
        if (!lesson.title || !lesson.title.trim()) {
          errors.push({ field: `lessons[${index}].title`, message: 'Lesson title is required' });
        }
      });
      if (errors.length === 0) {
        course.lessons = lessons.map((lesson, index) => ({
          title: sanitizeString(lesson.title),
          contentHtml: lesson.contentHtml || '',
          videoUrl: lesson.videoUrl || null,
          order: lesson.order || index + 1,
        }));
      }
    }
  }

  if (errors.length > 0) {
    const errorResponse = createErrorResponse('Validation failed', 400, errors);
    return res.status(400).json(errorResponse);
  }

  course = await course.save();

  const { response, statusCode } = createSuccessResponse('Course updated successfully', { course });
  res.status(statusCode).json(response);
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    const errorResponse = createErrorResponse('Course ID is required', 400);
    return res.status(400).json(errorResponse);
  }

  const course = await Course.findByIdAndDelete(id);
  if (!course) {
    const errorResponse = createErrorResponse('Course not found', 404);
    return res.status(404).json(errorResponse);
  }

  const { response, statusCode } = createSuccessResponse('Course deleted successfully');
  res.status(statusCode).json(response);
});

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
