# E-Learning Platform

A comprehensive, production-ready e-learning application demonstrating modern full-stack development, security best practices, and real-world features.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [API Documentation](#api-documentation)
7. [Project Structure](#project-structure)
8. [Database Schema](#database-schema)
9. [Security Features](#security-features)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [What I Learned From This Project](#what-i-learned-from-this-project)
13. [Troubleshooting](#troubleshooting)

---

## Project Overview

### Problem It Solves

This platform addresses the need for a modern, scalable e-learning solution that enables:
- **Students** to discover, enroll in, and track progress through online courses
- **Instructors** to create and manage course content with lessons and assessments
- **Administrators** to oversee the platform, manage users, and analyze engagement

### Target Users

- **Students**: Learners seeking structured online education with progress tracking
- **Instructors**: Content creators who want to teach and manage their courses
- **Administrators**: Platform managers who need oversight and control

### Key Capabilities

- Course discovery with search and filtering
- Secure user authentication and authorization
- Course enrollment and progress tracking
- Role-based access control (Student, Instructor, Admin)
- Admin dashboard for course and user management
- Responsive design for all devices

---

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Testing**: Vitest + React Testing Library
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (MongoDB with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Express validators
- **CORS**: Cross-Origin Resource Sharing
- **Testing**: Jest + Supertest

### DevOps & CI/CD
- **Version Control**: Git
- **CI/CD**: GitHub Actions
- **Frontend Deployment**: Vercel
- **Backend Deployment**: Render / Heroku
- **Database**: MongoDB Atlas

---

## Features

### Public Features
- **Course Browsing**: Filter by category, difficulty level, and search
- **Course Details**: View syllabus, lessons, instructor info, and course overview
- **Landing Page**: Marketing-focused homepage with feature highlights

### Student Features
- **Authentication**: Secure JWT-based signup and login
- **Enrollment**: Enroll in courses with one click
- **Dashboard**: Track enrolled courses and learning progress
- **Progress Tracking**: Monitor completion percentage for each course
- **Lesson Access**: View course content and lessons

### Instructor Features
- **Course Creation**: Create and manage courses with lessons
- **Content Management**: Add lessons with HTML content and video URLs
- **Student Analytics**: View enrollment statistics for their courses

### Admin Features
- **Course Management**: Create, edit, and delete courses
- **Lesson Management**: Add multiple lessons with content and videos
- **User Management**: View all users and their enrollments
- **Analytics**: Track enrollment statistics and user progress
- **Role Management**: Assign roles to users

---

## Getting Started

### Prerequisites

Before starting, ensure you have:
- **Node.js 16+**: [Download here](https://nodejs.org/)
- **npm 8+** (comes with Node.js)
- **MongoDB Atlas account**: [Free account](https://www.mongodb.com/cloud/atlas)
- **Git**: [Download here](https://git-scm.com/)
- **Code editor**: VS Code, WebStorm, or similar

### Verify Installation

```bash
# Check Node.js
node --version    # Should be v16 or higher

# Check npm
npm --version     # Should be 8 or higher

# Check Git
git --version     # Should show version
```

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see [Environment Variables](#environment-variables) section):
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/elearning
   JWT_SECRET=your_secure_jwt_secret_key_here
   JWT_REFRESH_SECRET=your_secure_refresh_secret_key_here
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

### Seeding Sample Data

To populate the database with sample courses and test users:

```bash
cd backend
npm run seed
```

**Test Accounts:**
- **Admin**: admin@example.com / password123
- **Student**: john@example.com / password123

---

## Environment Variables

### Backend (.env)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGO_URI` | MongoDB connection string | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/elearning` |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | `your_super_secret_key_here` |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | Yes | `your_refresh_secret_key_here` |
| `JWT_EXPIRE` | JWT token expiration time | No | `7d` (default) |
| `JWT_REFRESH_EXPIRE` | Refresh token expiration time | No | `30d` (default) |
| `PORT` | Server port | No | `5000` (default) |
| `NODE_ENV` | Environment mode | No | `development` or `production` |
| `FRONTEND_URL` | Frontend URL for CORS | No | `http://localhost:3000` |

### Frontend (.env.local)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | Yes | `http://localhost:5000/api` |

### Environment Variable Validation

The backend validates all required environment variables on startup. If any are missing, the server will not start and will display clear error messages.

---

## API Documentation

### Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-backend-domain.com/api`

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/signup` | Register new user | Public |
| `POST` | `/api/auth/login` | Login user | Public |
| `POST` | `/api/auth/refresh` | Refresh access token | Public |
| `POST` | `/api/auth/forgot-password` | Request password reset | Public |
| `POST` | `/api/auth/reset-password` | Reset password with token | Public |
| `GET` | `/api/auth/me` | Get current user | Private |

**Request Examples:**

```bash
# Signup
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}

# Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

# Get Current User
GET /api/auth/me
Authorization: Bearer <token>
```

#### Courses

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/courses` | Get all courses (with filters) | Public |
| `GET` | `/api/courses/:id` | Get single course | Public |
| `POST` | `/api/courses` | Create course | Admin/Instructor |
| `PUT` | `/api/courses/:id` | Update course | Admin/Instructor |
| `DELETE` | `/api/courses/:id` | Delete course | Admin |

**Query Parameters for GET /api/courses:**
- `category`: Filter by category (programming, design, business, etc.)
- `difficulty`: Filter by difficulty (beginner, intermediate, advanced)
- `search`: Search in title and description
- `page`: Page number for pagination
- `limit`: Items per page

**Request Examples:**

```bash
# Get all courses
GET /api/courses

# Get courses with filters
GET /api/courses?category=programming&difficulty=beginner&search=javascript

# Create course (Admin/Instructor)
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Advanced React Patterns",
  "description": "Learn advanced React patterns and best practices",
  "price": 99.99,
  "category": "programming",
  "difficulty": "advanced",
  "instructor": "Jane Smith",
  "lessons": [
    {
      "title": "Introduction",
      "contentHtml": "<p>Welcome to the course</p>",
      "order": 1
    }
  ]
}
```

#### Enrollments

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/enrollments` | Enroll in course | Student |
| `GET` | `/api/enrollments/me` | Get user enrollments | Student |
| `PUT` | `/api/enrollments/:id/progress` | Update progress | Student |
| `GET` | `/api/enrollments` | Get all enrollments | Admin |
| `GET` | `/api/enrollments/course/:courseId` | Get enrollments for course | Instructor/Admin |

**Request Examples:**

```bash
# Enroll in course
POST /api/enrollments
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "60d5ec49f1b2c72b8c8e4b1a"
}

# Update progress
PUT /api/enrollments/:id/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "lessonId": "60d5ec49f1b2c72b8c8e4b1b",
  "completed": true
}
```

#### Quizzes/Assessments

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/quizzes` | Create quiz | Instructor/Admin |
| `GET` | `/api/quizzes/course/:courseId` | Get quizzes for course | Public |
| `POST` | `/api/quizzes/:id/submit` | Submit quiz answers | Student |
| `GET` | `/api/quizzes/:id/results` | Get quiz results | Student |

### Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## Project Structure

```
E-Learning-Platform/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── env.js              # Environment variable validation
│   ├── models/
│   │   ├── User.js             # User schema (Student, Instructor, Admin)
│   │   ├── Course.js           # Course schema with lessons
│   │   ├── Enrollment.js       # Enrollment schema with progress
│   │   └── Quiz.js             # Quiz/Assessment schema
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── courseController.js # Course CRUD operations
│   │   ├── enrollmentController.js # Enrollment logic
│   │   └── quizController.js   # Quiz operations
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification
│   │   ├── roleMiddleware.js   # Role-based access control
│   │   └── rateLimiter.js      # Rate limiting
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   ├── courseRoutes.js     # Course endpoints
│   │   ├── enrollmentRoutes.js # Enrollment endpoints
│   │   └── quizRoutes.js       # Quiz endpoints
│   ├── services/
│   │   ├── emailService.js     # Email sending (password reset)
│   │   └── tokenService.js     # Token generation/validation
│   ├── utils/
│   │   ├── validators.js       # Input validation helpers
│   │   └── errors.js           # Error handling utilities
│   ├── tests/
│   │   ├── api.test.js         # API integration tests
│   │   └── unit/               # Unit tests
│   ├── server.js               # Express app entry point
│   ├── seed.js                 # Database seeding script
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js       # Axios API client
│   │   ├── components/
│   │   │   ├── common/         # Reusable UI components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   └── ErrorMessage.jsx
│   │   │   ├── CourseCard.jsx  # Course display card
│   │   │   ├── Header.jsx      # Navigation header
│   │   │   ├── Footer.jsx      # Footer
│   │   │   └── PrivateRoute.jsx # Route protection
│   │   ├── pages/
│   │   │   ├── Landing.jsx     # Homepage
│   │   │   ├── Courses.jsx     # Course listing
│   │   │   ├── CourseDetail.jsx # Course detail page
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Signup.jsx      # Signup page
│   │   │   ├── Dashboard.jsx   # Student dashboard
│   │   │   ├── InstructorDashboard.jsx # Instructor dashboard
│   │   │   ├── Admin.jsx       # Admin panel
│   │   │   └── Quiz.jsx        # Quiz/Assessment page
│   │   ├── services/
│   │   │   ├── authService.js  # Authentication API calls
│   │   │   ├── courseService.js # Course API calls
│   │   │   └── enrollmentService.js # Enrollment API calls
│   │   ├── hooks/
│   │   │   ├── useAuth.js      # Authentication hook
│   │   │   ├── useCourses.js   # Courses data hook
│   │   │   └── useEnrollments.js # Enrollments hook
│   │   ├── store/
│   │   │   └── authStore.js    # Zustand auth state
│   │   ├── App.jsx             # Main app component with routing
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── index.html              # HTML template
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS config
│   ├── package.json
│   └── .env.example
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # CI/CD pipeline
│
├── README.md                   # This file (single source of truth)
├── .gitignore
└── LICENSE
```

---

## Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  name: String (required, max 100 chars),
  email: String (required, unique, lowercase),
  passwordHash: String (required, min 6 chars, hashed with bcrypt),
  role: String (enum: ['student', 'instructor', 'admin'], default: 'student'),
  refreshToken: String (optional, for refresh token mechanism),
  createdAt: Date
}
```

**Roles:**
- `student`: Can enroll in courses, track progress, take quizzes
- `instructor`: Can create and manage courses, view student progress
- `admin`: Full access to all features

### Course Model

```javascript
{
  _id: ObjectId,
  title: String (required),
  slug: String (unique, auto-generated from title),
  description: String (required),
  price: Number (required, min 0),
  category: String (enum: ['programming', 'design', 'business', 'marketing', 'data-science', 'other']),
  difficulty: String (enum: ['beginner', 'intermediate', 'advanced']),
  instructor: String (required),
  instructorId: ObjectId (ref: User, for instructor role),
  thumbnailUrl: String (optional),
  lessons: [
    {
      _id: ObjectId,
      title: String (required),
      contentHtml: String,
      videoUrl: String,
      order: Number (required)
    }
  ],
  createdAt: Date
}
```

### Enrollment Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  courseId: ObjectId (ref: Course, required),
  progress: Map<lessonId, Boolean>, // Tracks which lessons are completed
  progressPercentage: Number (0-100, calculated),
  enrolledAt: Date,
  completedAt: Date (null until course completed)
}
```

**Indexes:**
- Compound unique index on `(userId, courseId)` to prevent duplicate enrollments

### Quiz Model

```javascript
{
  _id: ObjectId,
  courseId: ObjectId (ref: Course, required),
  title: String (required),
  description: String,
  questions: [
    {
      _id: ObjectId,
      question: String (required),
      type: String (enum: ['multiple-choice', 'true-false', 'short-answer']),
      options: [String], // For multiple-choice
      correctAnswer: String (required),
      points: Number (default: 1)
    }
  ],
  totalPoints: Number (calculated),
  createdAt: Date
}
```

---

## Security Features

### Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication
- **Refresh Tokens**: Long-lived refresh tokens for better security
- **Password Hashing**: bcrypt with salt rounds (10)
- **Role-Based Access Control**: Student, Instructor, Admin roles
- **Protected Routes**: Middleware-based route protection
- **Token Expiration**: Configurable token expiration times

### Input Validation

- **Server-Side Validation**: All inputs validated on backend
- **Client-Side Validation**: Frontend validation for better UX
- **Sanitization**: Input sanitization to prevent XSS
- **Type Checking**: Strict type validation for all inputs

### Security Best Practices

- **CORS**: Properly configured cross-origin requests
- **Rate Limiting**: Protection against brute force attacks
- **Environment Variables**: Sensitive data in .env files (never committed)
- **Password Reset**: Secure token-based password reset flow
- **Error Messages**: Generic error messages to prevent information leakage

---

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Test Structure:**
- Unit tests for controllers, models, and utilities
- Integration tests for API endpoints
- Test database (separate from development)

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui
```

**Test Structure:**
- Component tests with React Testing Library
- Hook tests
- Integration tests for user flows

### Manual Testing Checklist

- [ ] User can sign up
- [ ] User can log in
- [ ] User can browse courses
- [ ] User can enroll in course
- [ ] User can track progress
- [ ] Instructor can create course
- [ ] Admin can manage users
- [ ] Protected routes work correctly
- [ ] Error handling displays properly

---

## Deployment

### Environment-Based Configuration

The application supports different configurations for development and production:

- **Development**: `NODE_ENV=development` - Detailed error messages, hot reload
- **Production**: `NODE_ENV=production` - Optimized builds, generic errors, security headers

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variable: `VITE_API_URL=https://your-backend-url/api`
4. Deploy

### Backend Deployment (Render/Heroku)

1. Push code to GitHub
2. Create web service on Render/Heroku
3. Set environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL`
4. Deploy

### Database (MongoDB Atlas)

1. Create cluster
2. Create database user
3. Configure IP whitelist
4. Get connection string
5. Use in `MONGO_URI`

For detailed deployment instructions, see the deployment section in the project documentation.

---

## What I Learned From This Project

### Technical Skills

1. **Full-Stack Development**
   - Built a complete application from frontend to backend
   - Integrated React with Express.js REST API
   - Managed state across client and server

2. **Database Design**
   - Designed MongoDB schemas with proper relationships
   - Implemented indexes for performance
   - Created efficient data models for courses, users, and enrollments

3. **Authentication & Security**
   - Implemented JWT-based authentication
   - Added refresh token mechanism for better security
   - Created role-based access control system
   - Implemented password hashing and reset flows
   - Added rate limiting to protect against attacks

4. **API Design**
   - Designed RESTful API endpoints
   - Implemented proper error handling
   - Added input validation and sanitization
   - Created consistent response formats

5. **Frontend Architecture**
   - Organized React components into logical structure
   - Implemented protected routes
   - Created reusable UI components
   - Managed global state with Zustand
   - Implemented proper loading and error states

6. **DevOps & Deployment**
   - Set up CI/CD pipeline with GitHub Actions
   - Deployed to production platforms (Vercel, Render)
   - Configured environment-based settings

### Best Practices Learned

1. **Code Organization**
   - Separation of concerns (controllers, services, models)
   - Modular component structure
   - Reusable utilities and hooks

2. **Security**
   - Never commit secrets to version control
   - Validate all user inputs
   - Use environment variables for configuration
   - Implement proper authentication and authorization

3. **Testing**
   - Write tests for critical functionality
   - Test both success and error cases
   - Maintain good test coverage

4. **Documentation**
   - Keep documentation up-to-date
   - Write clear API documentation
   - Document environment variables
   - Include setup and deployment instructions

5. **User Experience**
   - Provide loading states
   - Show clear error messages
   - Implement proper form validation
   - Create responsive designs

### Challenges Overcome

1. **State Management**: Learned to manage complex state across components
2. **Authentication Flow**: Implemented secure token-based authentication
3. **Role-Based Access**: Created flexible permission system
4. **Progress Tracking**: Designed efficient progress tracking system
5. **API Design**: Created scalable and maintainable API structure

### Future Improvements

- Payment integration (Stripe)
- Video streaming with CDN
- Real-time notifications
- Discussion forums
- Certificate generation
- Advanced analytics
- Mobile app (React Native)

---

## Troubleshooting

### MongoDB Connection Error

**Problem:** `Error: connect ECONNREFUSED` or connection timeout

**Solutions:**
1. Check `MONGO_URI` in `.env` file
2. Verify IP whitelist in MongoDB Atlas (should include your IP or `0.0.0.0/0` for development)
3. Confirm database user credentials
4. Ensure cluster is running in MongoDB Atlas

### CORS Errors

**Problem:** `Cross-Origin Request Blocked` in browser console

**Solutions:**
1. Check `FRONTEND_URL` in backend `.env` matches your frontend URL
2. Verify CORS configuration in `server.js`
3. Check that `VITE_API_URL` in frontend `.env.local` is correct

### JWT Token Errors

**Problem:** `Token is not valid` or `No token provided`

**Solutions:**
1. Clear browser localStorage
2. Verify `JWT_SECRET` matches between environments
3. Check token expiration (default is 7 days)
4. Ensure token is sent in `Authorization: Bearer <token>` header

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Or change PORT in .env file
```

### Environment Variables Not Working

**Problem:** Variables are `undefined`

**Solutions:**
1. Ensure `.env` file exists in correct directory
2. Restart server after changing `.env` file
3. For frontend, ensure variables start with `VITE_`
4. Check for typos in variable names

### Tests Failing

**Problem:** Tests fail with connection or import errors

**Solutions:**
1. Run `npm install` to ensure all dependencies are installed
2. Check that test database is configured correctly
3. Clear test cache: `npm test -- --clearCache`
4. Verify test environment variables are set

---

## Additional Resources

### Quick Reference

For quick commands and common tasks, see the project's quick reference guide.

### Setup Guide

For detailed setup instructions, see the setup documentation.

### Deployment Guide

For production deployment steps, see the deployment documentation.

---

## License

ISC

---

## Support

For issues and questions:
1. Check this README and troubleshooting section
2. Review GitHub issues
3. Contact the development team

---

**Version**: 2.0.0  
**Last Updated**: January 2026  
**Status**: Production Ready ✅
