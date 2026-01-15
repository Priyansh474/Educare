#!/usr/bin/env node

/**
 * Seed Script for E-Learning Platform
 * 
 * This script populates the database with sample courses and users for testing.
 * 
 * Usage: node seed.js
 * 
 * Prerequisites:
 * - MongoDB Atlas connection string in .env
 * - Node modules installed (npm install)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash: 'password123',
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'password123',
        role: 'user',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        passwordHash: 'password123',
        role: 'user',
      },
    ]);
    console.log('Created users');

    // Create sample courses
    const courses = await Course.create([
      {
        title: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript programming. This course covers variables, functions, objects, and more.',
        price: 49.99,
        category: 'programming',
        difficulty: 'beginner',
        instructor: 'John Developer',
        lessons: [
          { title: 'Introduction to JavaScript', contentHtml: 'JavaScript is a versatile programming language...', order: 1 },
          { title: 'Variables and Data Types', contentHtml: 'Learn about const, let, and var...', order: 2 },
          { title: 'Functions and Scope', contentHtml: 'Understanding function declarations and scope...', order: 3 },
          { title: 'Objects and Arrays', contentHtml: 'Working with complex data structures...', order: 4 },
        ],
      },
      {
        title: 'React for Beginners',
        description: 'Master React.js from scratch. Learn components, hooks, and state management.',
        price: 59.99,
        category: 'programming',
        difficulty: 'beginner',
        instructor: 'Sarah Chen',
        lessons: [
          { title: 'React Setup and JSX', contentHtml: 'Introduction to React and JSX syntax...', order: 1 },
          { title: 'Components and Props', contentHtml: 'Creating functional and class components...', order: 2 },
          { title: 'Hooks Deep Dive', contentHtml: 'useState, useEffect, and custom hooks...', order: 3 },
          { title: 'State Management', contentHtml: 'Managing complex state with Context and Redux...', order: 4 },
        ],
      },
      {
        title: 'Web Design Principles',
        description: 'Create beautiful and functional user interfaces. Learn UX/UI principles and design tools.',
        price: 39.99,
        category: 'design',
        difficulty: 'beginner',
        instructor: 'Michael Design',
        lessons: [
          { title: 'Design Fundamentals', contentHtml: 'Color, typography, and spacing...', order: 1 },
          { title: 'User Experience Design', contentHtml: 'Understanding user needs and behavior...', order: 2 },
          { title: 'Wireframing and Prototyping', contentHtml: 'Tools and techniques for prototyping...', order: 3 },
        ],
      },
      {
        title: 'Node.js and Express',
        description: 'Build scalable server-side applications with Node.js and Express.',
        price: 69.99,
        category: 'programming',
        difficulty: 'intermediate',
        instructor: 'David Server',
        lessons: [
          { title: 'Node.js Basics', contentHtml: 'Understanding asynchronous programming...', order: 1 },
          { title: 'Express Framework', contentHtml: 'Routing, middleware, and error handling...', order: 2 },
          { title: 'Database Integration', contentHtml: 'Connecting to MongoDB and SQL databases...', order: 3 },
          { title: 'REST API Design', contentHtml: 'Building RESTful APIs with best practices...', order: 4 },
          { title: 'Authentication and Security', contentHtml: 'JWT, bcrypt, and security best practices...', order: 5 },
        ],
      },
      {
        title: 'Advanced JavaScript Patterns',
        description: 'Master advanced JavaScript concepts including closures, prototypes, and design patterns.',
        price: 79.99,
        category: 'programming',
        difficulty: 'advanced',
        instructor: 'Alex Expert',
        lessons: [
          { title: 'Closures and Scope', contentHtml: 'Deep understanding of closure mechanisms...', order: 1 },
          { title: 'Prototypal Inheritance', contentHtml: 'Objects and prototypal inheritance...', order: 2 },
          { title: 'Design Patterns', contentHtml: 'Common design patterns in JavaScript...', order: 3 },
          { title: 'Functional Programming', contentHtml: 'Immutability, higher-order functions, and more...', order: 4 },
        ],
      },
      {
        title: 'Data Science Fundamentals',
        description: 'Introduction to data science, statistics, and machine learning basics.',
        price: 89.99,
        category: 'data-science',
        difficulty: 'intermediate',
        instructor: 'Emma Data',
        lessons: [
          { title: 'Python for Data Science', contentHtml: 'NumPy, Pandas, and data manipulation...', order: 1 },
          { title: 'Statistics Basics', contentHtml: 'Probability, distributions, and hypothesis testing...', order: 2 },
          { title: 'Data Visualization', contentHtml: 'Creating meaningful visualizations with Matplotlib...', order: 3 },
        ],
      },
      {
        title: 'Business Strategy 101',
        description: 'Learn fundamental business strategies and entrepreneurship principles.',
        price: 44.99,
        category: 'business',
        difficulty: 'beginner',
        instructor: 'Robert Business',
        lessons: [
          { title: 'Business Fundamentals', contentHtml: 'Understanding business models and markets...', order: 1 },
          { title: 'Strategic Planning', contentHtml: 'Long-term business strategy and planning...', order: 2 },
          { title: 'Finance Basics', contentHtml: 'Reading financial statements and budgeting...', order: 3 },
        ],
      },
      {
        title: 'Digital Marketing Mastery',
        description: 'Master digital marketing strategies including SEO, social media, and content marketing.',
        price: 54.99,
        category: 'marketing',
        difficulty: 'intermediate',
        instructor: 'Lisa Marketing',
        lessons: [
          { title: 'SEO Fundamentals', contentHtml: 'Optimizing for search engines...', order: 1 },
          { title: 'Social Media Strategy', contentHtml: 'Building audience on social platforms...', order: 2 },
          { title: 'Content Marketing', contentHtml: 'Creating engaging content that converts...', order: 3 },
          { title: 'Analytics and Metrics', contentHtml: 'Measuring success with data...', order: 4 },
        ],
      },
    ]);
    console.log('Created courses');

    console.log('✓ Database seeded successfully');
    console.log(`\n📊 Statistics:`);
    console.log(`- Users created: ${users.length}`);
    console.log(`- Courses created: ${courses.length}`);
    console.log(`\n👤 Test Accounts:`);
    console.log(`Admin - Email: admin@example.com, Password: password123`);
    console.log(`User  - Email: john@example.com, Password: password123`);
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    mongoose.connection.close();
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();
