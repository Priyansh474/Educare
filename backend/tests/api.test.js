const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Course = require('../models/Course');

describe('Auth API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/elearning-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const response = await request(app).post('/api/auth/signup').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.token).toBeDefined();
    });

    it('should fail with missing fields', async () => {
      const response = await request(app).post('/api/auth/signup').send({
        name: 'Test User',
        email: 'test@example.com',
      });

      expect(response.status).toBe(400);
    });

    it('should fail with duplicate email', async () => {
      await User.create({
        name: 'Existing User',
        email: 'test@example.com',
        passwordHash: 'hash',
      });

      const response = await request(app).post('/api/auth/signup').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'password123',
      });
    });

    it('should login successfully', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
    });
  });
});

describe('Courses API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/elearning-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Course.deleteMany({});
  });

  describe('GET /api/courses', () => {
    beforeEach(async () => {
      await Course.create([
        {
          title: 'JavaScript Course',
          description: 'Learn JavaScript',
          price: 49.99,
          category: 'programming',
          difficulty: 'beginner',
          instructor: 'John Doe',
          lessons: [],
        },
        {
          title: 'React Course',
          description: 'Learn React',
          price: 59.99,
          category: 'programming',
          difficulty: 'intermediate',
          instructor: 'Jane Smith',
          lessons: [],
        },
      ]);
    });

    it('should get all courses', async () => {
      const response = await request(app).get('/api/courses');

      expect(response.status).toBe(200);
      expect(response.body.courses.length).toBe(2);
    });

    it('should filter by category', async () => {
      const response = await request(app).get('/api/courses?category=programming');

      expect(response.status).toBe(200);
      expect(response.body.courses.length).toBe(2);
    });

    it('should search by title', async () => {
      const response = await request(app).get('/api/courses?search=JavaScript');

      expect(response.status).toBe(200);
      expect(response.body.courses.length).toBe(1);
      expect(response.body.courses[0].title).toContain('JavaScript');
    });
  });
});
