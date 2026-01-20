const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a lesson title'],
  },
  contentHtml: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: null,
  },
  order: {
    type: Number,
    required: true,
  },
});

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0,
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['programming', 'design', 'business', 'marketing', 'data-science', 'other'],
  },
  difficulty: {
    type: String,
    required: [true, 'Please select a difficulty level'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  thumbnailUrl: {
    type: String,
    default: null,
  },
  instructor: {
    type: String,
    required: [true, 'Please provide instructor name'],
  },
  lessons: [LessonSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate slug from title
CourseSchema.pre('save', async function () {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
});

module.exports = mongoose.model('Course', CourseSchema);
