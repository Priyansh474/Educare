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
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
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
        role: 'student',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        passwordHash: 'password123',
        role: 'instructor',
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
        thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Introduction to JavaScript', contentHtml: 'JavaScript is a versatile programming language...', videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', order: 1 },
          { title: 'Variables and Data Types', contentHtml: 'Learn about const, let, and var...', videoUrl: 'https://www.youtube.com/watch?v=IsG4Xd6LlsM', order: 2 },
          { title: 'Functions and Scope', contentHtml: 'Understanding function declarations and scope...', videoUrl: 'https://www.youtube.com/watch?v=N8ap4k_1QEQ', order: 3 },
          { title: 'Objects and Arrays', contentHtml: 'Working with complex data structures...', videoUrl: 'https://www.youtube.com/watch?v=7W4pQQ20nJg', order: 4 },
        ],
      },
      {
        title: 'React for Beginners',
        description: 'Master React.js from scratch. Learn components, hooks, and state management.',
        price: 59.99,
        category: 'programming',
        difficulty: 'beginner',
        instructor: 'Sarah Chen',
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
        lessons: [
          { title: 'React Setup and JSX', contentHtml: 'Introduction to React and JSX syntax...', videoUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk', order: 1 },
          { title: 'Components and Props', contentHtml: 'Creating functional and class components...', videoUrl: 'https://www.youtube.com/watch?v=LYl4xAu8e-U', order: 2 },
          { title: 'Hooks Deep Dive', contentHtml: 'useState, useEffect, and custom hooks...', videoUrl: 'https://www.youtube.com/watch?v=O6P86uwfdR0', order: 3 },
          { title: 'State Management', contentHtml: 'Managing complex state with Context and Redux...', videoUrl: 'https://www.youtube.com/watch?v=35lXWvCuM8o', order: 4 },
        ],
      },
      {
        title: 'Web Design Principles',
        description: 'Create beautiful and functional user interfaces. Learn UX/UI principles and design tools.',
        price: 39.99,
        category: 'design',
        difficulty: 'beginner',
        instructor: 'Michael Design',
        thumbnailUrl: 'https://images.unsplash.com/photo-1561070796-0cdf75196e7a?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Design Fundamentals', contentHtml: 'Color, typography, and spacing...', videoUrl: 'https://www.youtube.com/watch?v=ZbrzdMaumNk', order: 1 },
          { title: 'User Experience Design', contentHtml: 'Understanding user needs and behavior...', videoUrl: 'https://www.youtube.com/watch?v=Ovj4hFxko7c', order: 2 },
          { title: 'Wireframing and Prototyping', contentHtml: 'Tools and techniques for prototyping...', videoUrl: 'https://www.youtube.com/watch?v=qpH7-KFWZRI', order: 3 },
        ],
      },
      {
        title: 'Node.js and Express',
        description: 'Build scalable server-side applications with Node.js and Express.',
        price: 69.99,
        category: 'programming',
        difficulty: 'intermediate',
        instructor: 'David Server',
        thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Node.js Basics', contentHtml: 'Understanding asynchronous programming...', videoUrl: 'https://www.youtube.com/watch?v=TlB_eWDSMt4', order: 1 },
          { title: 'Express Framework', contentHtml: 'Routing, middleware, and error handling...', videoUrl: 'https://www.youtube.com/watch?v=L72fhGm1tfE', order: 2 },
          { title: 'Database Integration', contentHtml: 'Connecting to MongoDB and SQL databases...', videoUrl: 'https://www.youtube.com/watch?v=Wf4d2pI0-t8', order: 3 },
          { title: 'REST API Design', contentHtml: 'Building RESTful APIs with best practices...', videoUrl: 'https://www.youtube.com/watch?v=7YcW25PHnAA', order: 4 },
          { title: 'Authentication and Security', contentHtml: 'JWT, bcrypt, and security best practices...', videoUrl: 'https://www.youtube.com/watch?v=mbsmsi7l3r4', order: 5 },
        ],
      },
      {
        title: 'Advanced JavaScript Patterns',
        description: 'Master advanced JavaScript concepts including closures, prototypes, and design patterns.',
        price: 79.99,
        category: 'programming',
        difficulty: 'advanced',
        instructor: 'Alex Expert',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Closures and Scope', contentHtml: 'Deep understanding of closure mechanisms...', videoUrl: 'https://www.youtube.com/watch?v=3a0I8ICR1Vg', order: 1 },
          { title: 'Prototypal Inheritance', contentHtml: 'Objects and prototypal inheritance...', videoUrl: 'https://www.youtube.com/watch?v=wfMtDGfHWpA', order: 2 },
          { title: 'Design Patterns', contentHtml: 'Common design patterns in JavaScript...', videoUrl: 'https://www.youtube.com/watch?v=3PUVr8jFMGg', order: 3 },
          { title: 'Functional Programming', contentHtml: 'Immutability, higher-order functions, and more...', videoUrl: 'https://www.youtube.com/watch?v=BMUiFMZr7vk', order: 4 },
        ],
      },
      {
        title: 'Data Science Fundamentals',
        description: 'Introduction to data science, statistics, and machine learning basics.',
        price: 89.99,
        category: 'data-science',
        difficulty: 'intermediate',
        instructor: 'Emma Data',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Python for Data Science', contentHtml: 'NumPy, Pandas, and data manipulation...', videoUrl: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI', order: 1 },
          { title: 'Statistics Basics', contentHtml: 'Probability, distributions, and hypothesis testing...', videoUrl: 'https://www.youtube.com/watch?v=uhxtUt_-GyM', order: 2 },
          { title: 'Data Visualization', contentHtml: 'Creating meaningful visualizations with Matplotlib...', videoUrl: 'https://www.youtube.com/watch?v=DAQNHzOcO5A', order: 3 },
        ],
      },
      {
        title: 'Business Strategy 101',
        description: 'Learn fundamental business strategies and entrepreneurship principles.',
        price: 44.99,
        category: 'business',
        difficulty: 'beginner',
        instructor: 'Robert Business',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Business Fundamentals', contentHtml: 'Understanding business models and markets...', videoUrl: 'https://www.youtube.com/watch?v=Ihh9dtCl4_Y', order: 1 },
          { title: 'Strategic Planning', contentHtml: 'Long-term business strategy and planning...', videoUrl: 'https://www.youtube.com/watch?v=sY8aFSY1y_A', order: 2 },
          { title: 'Finance Basics', contentHtml: 'Reading financial statements and budgeting...', videoUrl: 'https://www.youtube.com/watch?v=EW4CyNq9f7Q', order: 3 },
        ],
      },
      {
        title: 'Digital Marketing Mastery',
        description: 'Master digital marketing strategies including SEO, social media, and content marketing.',
        price: 54.99,
        category: 'marketing',
        difficulty: 'intermediate',
        instructor: 'Lisa Marketing',
        thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
        lessons: [
          { title: 'SEO Fundamentals', contentHtml: 'Optimizing for search engines...', videoUrl: 'https://www.youtube.com/watch?v=xsVTqzratPs', order: 1 },
          { title: 'Social Media Strategy', contentHtml: 'Building audience on social platforms...', videoUrl: 'https://www.youtube.com/watch?v=xN2YYyPc-tI', order: 2 },
          { title: 'Content Marketing', contentHtml: 'Creating engaging content that converts...', videoUrl: 'https://www.youtube.com/watch?v=JI1HZ-CZc1Q', order: 3 },
          { title: 'Analytics and Metrics', contentHtml: 'Measuring success with data...', videoUrl: 'https://www.youtube.com/watch?v=PLdF7qxd1vE', order: 4 },
        ],
      },
      {
        title: 'Python Programming Essentials',
        description: 'Learn Python from scratch. Perfect for beginners who want to start their programming journey.',
        price: 49.99,
        category: 'programming',
        difficulty: 'beginner',
        instructor: 'Python Master',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Python Installation and Setup', contentHtml: 'Setting up Python environment and IDE...', videoUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8', order: 1 },
          { title: 'Variables and Data Types', contentHtml: 'Understanding Python data types and variables...', videoUrl: 'https://www.youtube.com/watch?v=khKv-8q7YmY', order: 2 },
          { title: 'Control Flow', contentHtml: 'If statements, loops, and conditionals...', videoUrl: 'https://www.youtube.com/watch?v=Z1Yd7upQsXY', order: 3 },
          { title: 'Functions and Modules', contentHtml: 'Creating reusable functions and importing modules...', videoUrl: 'https://www.youtube.com/watch?v=NSbOtYzIQI0', order: 4 },
          { title: 'File Handling', contentHtml: 'Reading and writing files in Python...', videoUrl: 'https://www.youtube.com/watch?v=Uh2ebFW8OYM', order: 5 },
        ],
      },
      {
        title: 'Vue.js Complete Guide',
        description: 'Build modern web applications with Vue.js. Learn components, routing, and state management.',
        price: 64.99,
        category: 'programming',
        difficulty: 'intermediate',
        instructor: 'Vue Expert',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Vue.js Introduction', contentHtml: 'Understanding Vue.js and its ecosystem...', videoUrl: 'https://www.youtube.com/watch?v=4deVCNJq3qc', order: 1 },
          { title: 'Components and Templates', contentHtml: 'Creating and using Vue components...', videoUrl: 'https://www.youtube.com/watch?v=z6hQqgvGI4Y', order: 2 },
          { title: 'Vue Router', contentHtml: 'Setting up routing in Vue applications...', videoUrl: 'https://www.youtube.com/watch?v=PaF2Wvn9jYA', order: 3 },
          { title: 'Vuex State Management', contentHtml: 'Managing application state with Vuex...', videoUrl: 'https://www.youtube.com/watch?v=wZmV1t1xYjA', order: 4 },
          { title: 'Advanced Patterns', contentHtml: 'Composition API and advanced techniques...', videoUrl: 'https://www.youtube.com/watch?v=ycdTgq3X4Vw', order: 5 },
        ],
      },
      {
        title: 'TypeScript for JavaScript Developers',
        description: 'Master TypeScript to build more robust and maintainable JavaScript applications.',
        price: 59.99,
        category: 'programming',
        difficulty: 'intermediate',
        instructor: 'TypeScript Pro',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop',
        lessons: [
          { title: 'TypeScript Basics', contentHtml: 'Introduction to types and type annotations...', videoUrl: 'https://www.youtube.com/watch?v=ZchBYjHFCC4', order: 1 },
          { title: 'Interfaces and Types', contentHtml: 'Defining custom types and interfaces...', videoUrl: 'https://www.youtube.com/watch?v=zQnBQ4tB3ZA', order: 2 },
          { title: 'Generics', contentHtml: 'Creating reusable code with generics...', videoUrl: 'https://www.youtube.com/watch?v=nViEqpgwxHE', order: 3 },
          { title: 'Advanced Types', contentHtml: 'Union types, intersection types, and more...', videoUrl: 'https://www.youtube.com/watch?v=O8j24HY2Wdk', order: 4 },
        ],
      },
      {
        title: 'UI/UX Design Masterclass',
        description: 'Learn professional UI/UX design principles and create stunning user interfaces.',
        price: 79.99,
        category: 'design',
        difficulty: 'intermediate',
        instructor: 'Design Guru',
        thumbnailUrl: 'https://images.unsplash.com/photo-1561070796-0cdf75196e7a?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Design Thinking Process', contentHtml: 'Understanding user-centered design...', videoUrl: 'https://www.youtube.com/watch?v=UeG1ftTmLAg', order: 1 },
          { title: 'Color Theory and Psychology', contentHtml: 'Using colors effectively in design...', videoUrl: 'https://www.youtube.com/watch?v=Qj1FK8n7WgY', order: 2 },
          { title: 'Typography Fundamentals', contentHtml: 'Choosing and pairing fonts...', videoUrl: 'https://www.youtube.com/watch?v=sByzHoiYFX0', order: 3 },
          { title: 'Layout and Composition', contentHtml: 'Creating balanced and effective layouts...', videoUrl: 'https://www.youtube.com/watch?v=338_rEksjnI', order: 4 },
          { title: 'Prototyping with Figma', contentHtml: 'Building interactive prototypes...', videoUrl: 'https://www.youtube.com/watch?v=Cx2dkpBxL8c', order: 5 },
          { title: 'User Testing', contentHtml: 'Conducting usability tests and gathering feedback...', videoUrl: 'https://www.youtube.com/watch?v=QckIzHC99Xc', order: 6 },
        ],
      },
      {
        title: 'Adobe Photoshop for Beginners',
        description: 'Master the fundamentals of Adobe Photoshop and create stunning graphics.',
        price: 45.99,
        category: 'design',
        difficulty: 'beginner',
        instructor: 'Photo Master',
        thumbnailUrl: 'https://images.unsplash.com/photo-1614027164689-a18ed3b2d49e?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Photoshop Interface', contentHtml: 'Navigating the Photoshop workspace...', videoUrl: 'https://www.youtube.com/watch?v=IyR_uYsRdPs', order: 1 },
          { title: 'Basic Tools and Techniques', contentHtml: 'Using selection, brush, and layer tools...', videoUrl: 'https://www.youtube.com/watch?v=QNK_1bJc8hY', order: 2 },
          { title: 'Image Retouching', contentHtml: 'Removing blemishes and enhancing photos...', videoUrl: 'https://www.youtube.com/watch?v=x7EIe3bP5oo', order: 3 },
          { title: 'Working with Layers', contentHtml: 'Understanding layers and layer masks...', videoUrl: 'https://www.youtube.com/watch?v=7XdEVpQE0iw', order: 4 },
        ],
      },
      {
        title: 'Machine Learning Basics',
        description: 'Introduction to machine learning concepts, algorithms, and practical applications.',
        price: 99.99,
        category: 'data-science',
        difficulty: 'intermediate',
        instructor: 'ML Scientist',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Introduction to ML', contentHtml: 'What is machine learning and its applications...', videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk', order: 1 },
          { title: 'Supervised Learning', contentHtml: 'Classification and regression algorithms...', videoUrl: 'https://www.youtube.com/watch?v=kE5QZ8G_78c', order: 2 },
          { title: 'Unsupervised Learning', contentHtml: 'Clustering and dimensionality reduction...', videoUrl: 'https://www.youtube.com/watch?v=J1hG9SgB-t4', order: 3 },
          { title: 'Neural Networks Basics', contentHtml: 'Introduction to deep learning...', videoUrl: 'https://www.youtube.com/watch?v=Ilg3gGewQ5U', order: 4 },
          { title: 'Model Evaluation', contentHtml: 'Testing and improving ML models...', videoUrl: 'https://www.youtube.com/watch?v=85dtiMz9tSo', order: 5 },
        ],
      },
      {
        title: 'SQL Database Mastery',
        description: 'Learn SQL from scratch and master database querying and management.',
        price: 54.99,
        category: 'programming',
        difficulty: 'beginner',
        instructor: 'Database Expert',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Database Fundamentals', contentHtml: 'Understanding databases and tables...', videoUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', order: 1 },
          { title: 'SELECT Queries', contentHtml: 'Retrieving data with SELECT statements...', videoUrl: 'https://www.youtube.com/watch?v=2-1XQHAgDsM', order: 2 },
          { title: 'JOIN Operations', contentHtml: 'Combining data from multiple tables...', videoUrl: 'https://www.youtube.com/watch?v=9yeOJ0ZMUYw', order: 3 },
          { title: 'Aggregate Functions', contentHtml: 'Using COUNT, SUM, AVG, and GROUP BY...', videoUrl: 'https://www.youtube.com/watch?v=YufocuHgZIM', order: 4 },
          { title: 'Subqueries and CTEs', contentHtml: 'Advanced querying techniques...', videoUrl: 'https://www.youtube.com/watch?v=Z_tJHMJar70', order: 5 },
        ],
      },
      {
        title: 'Entrepreneurship Fundamentals',
        description: 'Learn how to start and grow your own business from idea to execution.',
        price: 69.99,
        category: 'business',
        difficulty: 'beginner',
        instructor: 'Business Coach',
        thumbnailUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Business Idea Validation', contentHtml: 'Testing and validating your business idea...', videoUrl: 'https://www.youtube.com/watch?v=9QKLFH2i7Ko', order: 1 },
          { title: 'Business Plan Creation', contentHtml: 'Writing a comprehensive business plan...', videoUrl: 'https://www.youtube.com/watch?v=Fqch5OrUPvA', order: 2 },
          { title: 'Funding and Finance', contentHtml: 'Understanding funding options and financial management...', videoUrl: 'https://www.youtube.com/watch?v=xKOd01_4LME', order: 3 },
          { title: 'Marketing Your Business', contentHtml: 'Building brand awareness and customer base...', videoUrl: 'https://www.youtube.com/watch?v=CoYWHh-GxK0', order: 4 },
          { title: 'Scaling Your Business', contentHtml: 'Growing and expanding your business...', videoUrl: 'https://www.youtube.com/watch?v=2lhwkPnzH5A', order: 5 },
        ],
      },
      {
        title: 'Project Management Professional',
        description: 'Master project management methodologies and tools to deliver successful projects.',
        price: 74.99,
        category: 'business',
        difficulty: 'intermediate',
        instructor: 'PM Expert',
        thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Project Management Basics', contentHtml: 'Understanding project lifecycle...', videoUrl: 'https://www.youtube.com/watch?v=BOU1YP5NZVA', order: 1 },
          { title: 'Agile Methodology', contentHtml: 'Scrum, Kanban, and agile frameworks...', videoUrl: 'https://www.youtube.com/watch?v=Z9QbYZh1YXY', order: 2 },
          { title: 'Risk Management', contentHtml: 'Identifying and managing project risks...', videoUrl: 'https://www.youtube.com/watch?v=1T2ddGfPZV8', order: 3 },
          { title: 'Team Leadership', contentHtml: 'Leading and motivating project teams...', videoUrl: 'https://www.youtube.com/watch?v=SRb8TjQ1_xY', order: 4 },
          { title: 'Project Tools', contentHtml: 'Using Jira, Trello, and other PM tools...', videoUrl: 'https://www.youtube.com/watch?v=CEQSoX3xtEQ', order: 5 },
        ],
      },
      {
        title: 'Content Writing Mastery',
        description: 'Learn to write engaging content that captivates readers and drives conversions.',
        price: 44.99,
        category: 'marketing',
        difficulty: 'beginner',
        instructor: 'Content Writer',
        thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Writing Fundamentals', contentHtml: 'Grammar, style, and voice...', videoUrl: 'https://www.youtube.com/watch?v=EyPTbcbFvHo', order: 1 },
          { title: 'SEO Writing', contentHtml: 'Writing content that ranks in search engines...', videoUrl: 'https://www.youtube.com/watch?v=UoSNgX6F4Uk', order: 2 },
          { title: 'Blog Writing', contentHtml: 'Creating engaging blog posts...', videoUrl: 'https://www.youtube.com/watch?v=VMHclvHQLdM', order: 3 },
          { title: 'Copywriting', contentHtml: 'Writing persuasive copy that converts...', videoUrl: 'https://www.youtube.com/watch?v=YzDD2--oqcU', order: 4 },
        ],
      },
      {
        title: 'Email Marketing Strategies',
        description: 'Build and grow your email list and create campaigns that drive results.',
        price: 49.99,
        category: 'marketing',
        difficulty: 'beginner',
        instructor: 'Email Marketer',
        thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Email Marketing Basics', contentHtml: 'Understanding email marketing fundamentals...', videoUrl: 'https://www.youtube.com/watch?v=Qo2O0S7M7BI', order: 1 },
          { title: 'Building Your List', contentHtml: 'Growing your subscriber base...', videoUrl: 'https://www.youtube.com/watch?v=2QvNGm3P2QA', order: 2 },
          { title: 'Email Campaign Design', contentHtml: 'Creating effective email templates...', videoUrl: 'https://www.youtube.com/watch?v=kO8vqHqVbEw', order: 3 },
          { title: 'Automation and Segmentation', contentHtml: 'Setting up automated email sequences...', videoUrl: 'https://www.youtube.com/watch?v=8_-W4dMm2Rg', order: 4 },
          { title: 'Analytics and Optimization', contentHtml: 'Measuring and improving email performance...', videoUrl: 'https://www.youtube.com/watch?v=oKl7VDbUHvw', order: 5 },
        ],
      },
      {
        title: 'GraphQL API Development',
        description: 'Build modern APIs with GraphQL. Learn queries, mutations, and subscriptions.',
        price: 69.99,
        category: 'programming',
        difficulty: 'intermediate',
        instructor: 'API Developer',
        thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
        lessons: [
          { title: 'GraphQL Introduction', contentHtml: 'Understanding GraphQL vs REST...', videoUrl: 'https://www.youtube.com/watch?v=eIQh02xuVw4', order: 1 },
          { title: 'Schema Design', contentHtml: 'Designing GraphQL schemas...', videoUrl: 'https://www.youtube.com/watch?v=ed8SzALpx1Q', order: 2 },
          { title: 'Queries and Mutations', contentHtml: 'Implementing queries and mutations...', videoUrl: 'https://www.youtube.com/watch?v=Y0lDGjwRYKw', order: 3 },
          { title: 'Subscriptions', contentHtml: 'Real-time data with GraphQL subscriptions...', videoUrl: 'https://www.youtube.com/watch?v=RCQHVB4Azxo', order: 4 },
          { title: 'Authentication and Security', contentHtml: 'Securing GraphQL APIs...', videoUrl: 'https://www.youtube.com/watch?v=1VPdo72u44s', order: 5 },
        ],
      },
      {
        title: 'AWS Cloud Computing',
        description: 'Master Amazon Web Services and deploy scalable cloud applications.',
        price: 89.99,
        category: 'programming',
        difficulty: 'advanced',
        instructor: 'Cloud Architect',
        thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
        lessons: [
          { title: 'AWS Fundamentals', contentHtml: 'Understanding AWS services and architecture...', videoUrl: 'https://www.youtube.com/watch?v=ulprqHHWlng', order: 1 },
          { title: 'EC2 and Compute', contentHtml: 'Working with virtual servers...', videoUrl: 'https://www.youtube.com/watch?v=RxTfc4FyMKM', order: 2 },
          { title: 'S3 and Storage', contentHtml: 'Managing cloud storage...', videoUrl: 'https://www.youtube.com/watch?v=77lMCiiMilo', order: 3 },
          { title: 'RDS and Databases', contentHtml: 'Setting up managed databases...', videoUrl: 'https://www.youtube.com/watch?v=e2x5-q0ZnGw', order: 4 },
          { title: 'Lambda and Serverless', contentHtml: 'Building serverless applications...', videoUrl: 'https://www.youtube.com/watch?v=EBSdyoO3goc', order: 5 },
          { title: 'DevOps on AWS', contentHtml: 'CI/CD pipelines and automation...', videoUrl: 'https://www.youtube.com/watch?v=Y97wobQQakQ', order: 6 },
        ],
      },
      {
        title: 'Mobile App Development with React Native',
        description: 'Build cross-platform mobile apps using React Native and JavaScript.',
        price: 79.99,
        category: 'programming',
        difficulty: 'intermediate',
        instructor: 'Mobile Dev',
        thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
        lessons: [
          { title: 'React Native Setup', contentHtml: 'Setting up development environment...', videoUrl: 'https://www.youtube.com/watch?v=0-S5a0eXPoc', order: 1 },
          { title: 'Components and Navigation', contentHtml: 'Building UI and navigation...', videoUrl: 'https://www.youtube.com/watch?v=K1QICrgxTjA', order: 2 },
          { title: 'State Management', contentHtml: 'Managing app state with Redux...', videoUrl: 'https://www.youtube.com/watch?v=1gsHu4qm0kw', order: 3 },
          { title: 'API Integration', contentHtml: 'Connecting to backend services...', videoUrl: 'https://www.youtube.com/watch?v=YvFeXcspxQg', order: 4 },
          { title: 'Publishing Apps', contentHtml: 'Deploying to App Store and Play Store...', videoUrl: 'https://www.youtube.com/watch?v=5LEkqI8UDOo', order: 5 },
        ],
      },
      {
        title: 'Cybersecurity Fundamentals',
        description: 'Learn essential cybersecurity concepts to protect systems and data.',
        price: 84.99,
        category: 'programming',
        difficulty: 'intermediate',
        instructor: 'Security Expert',
        thumbnailUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Security Basics', contentHtml: 'Understanding threats and vulnerabilities...', videoUrl: 'https://www.youtube.com/watch?v=inWWhr5tnEA', order: 1 },
          { title: 'Network Security', contentHtml: 'Protecting network infrastructure...', videoUrl: 'https://www.youtube.com/watch?v=krYg3PdgQos', order: 2 },
          { title: 'Web Application Security', contentHtml: 'Securing web apps from attacks...', videoUrl: 'https://www.youtube.com/watch?v=rWHvp7rUka8', order: 3 },
          { title: 'Encryption and Cryptography', contentHtml: 'Understanding encryption methods...', videoUrl: 'https://www.youtube.com/watch?v=AQDCe585Lnc', order: 4 },
          { title: 'Security Best Practices', contentHtml: 'Implementing security measures...', videoUrl: 'https://www.youtube.com/watch?v=5Mcj13j2eSM', order: 5 },
        ],
      },
      {
        title: 'Docker and Containerization',
        description: 'Master Docker to containerize applications and streamline deployment.',
        price: 64.99,
        category: 'programming',
        difficulty: 'intermediate',
        instructor: 'DevOps Engineer',
        thumbnailUrl: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Docker Basics', contentHtml: 'Understanding containers and images...', videoUrl: 'https://www.youtube.com/watch?v=fqMOX6JJhGo', order: 1 },
          { title: 'Dockerfile Creation', contentHtml: 'Writing Dockerfiles for applications...', videoUrl: 'https://www.youtube.com/watch?v=Wm99C_f7Kxw', order: 2 },
          { title: 'Docker Compose', contentHtml: 'Orchestrating multi-container applications...', videoUrl: 'https://www.youtube.com/watch?v=HG6yIjZapSA', order: 3 },
          { title: 'Container Registry', contentHtml: 'Pushing and pulling images...', videoUrl: 'https://www.youtube.com/watch?v=Gjnup-PuquQ', order: 4 },
          { title: 'Production Deployment', contentHtml: 'Deploying containers in production...', videoUrl: 'https://www.youtube.com/watch?v=gAkwW2tuIqE', order: 5 },
        ],
      },
      {
        title: 'Advanced Data Analysis with Python',
        description: 'Deep dive into data analysis using pandas, numpy, and visualization libraries.',
        price: 74.99,
        category: 'data-science',
        difficulty: 'advanced',
        instructor: 'Data Analyst',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        lessons: [
          { title: 'Pandas Mastery', contentHtml: 'Advanced data manipulation with pandas...', videoUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg', order: 1 },
          { title: 'Data Cleaning', contentHtml: 'Handling missing data and outliers...', videoUrl: 'https://www.youtube.com/watch?v=KdmPHEnPJPs', order: 2 },
          { title: 'Statistical Analysis', contentHtml: 'Performing statistical tests and analysis...', videoUrl: 'https://www.youtube.com/watch?v=rYefUsYuEp0', order: 3 },
          { title: 'Data Visualization', contentHtml: 'Creating advanced visualizations...', videoUrl: 'https://www.youtube.com/watch?v=OZqDxhWSJxM', order: 4 },
          { title: 'Time Series Analysis', contentHtml: 'Analyzing time-based data...', videoUrl: 'https://www.youtube.com/watch?v=_9lBwXnbOd8', order: 5 },
        ],
      },
    ]);
    console.log('Created courses');

    console.log('✓ Database seeded successfully');
    console.log(`\n📊 Statistics:`);
    console.log(`- Users created: ${users.length}`);
    console.log(`- Courses created: ${courses.length}`);
    console.log(`\n📚 Course Categories:`);
    const categoryCount = courses.reduce((acc, course) => {
      acc[course.category] = (acc[course.category] || 0) + 1;
      return acc;
    }, {});
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count} courses`);
    });
    console.log(`\n👤 Test Accounts:`);
    console.log(`Admin     - Email: admin@example.com, Password: password123`);
    console.log(`Student   - Email: john@example.com, Password: password123`);
    console.log(`Instructor - Email: jane@example.com, Password: password123`);
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
