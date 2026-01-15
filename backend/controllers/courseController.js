const Course = require('../models/Course');

// @desc    Get all courses with filters
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const { category, difficulty, search, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const courses = await Course.find(filter).skip(skip).limit(parseInt(limit));
    const total = await Course.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      courses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course by ID or slug
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find by ID first, then by slug
    let course = await Course.findById(id);
    if (!course) {
      course = await Course.findOne({ slug: id });
    }

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  try {
    const { title, description, price, category, difficulty, instructor, lessons = [] } = req.body;

    // Validate required fields
    if (!title || !description || !price || !category || !difficulty || !instructor) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create course
    const course = await Course.create({
      title,
      description,
      price,
      category,
      difficulty,
      instructor,
      lessons: lessons.map((lesson, index) => ({
        ...lesson,
        order: lesson.order || index + 1,
      })),
    });

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, difficulty, instructor, lessons } = req.body;

    let course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update fields
    if (title) course.title = title;
    if (description) course.description = description;
    if (price !== undefined) course.price = price;
    if (category) course.category = category;
    if (difficulty) course.difficulty = difficulty;
    if (instructor) course.instructor = instructor;
    if (lessons) {
      course.lessons = lessons.map((lesson, index) => ({
        ...lesson,
        order: lesson.order || index + 1,
      }));
    }

    course = await course.save();

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
