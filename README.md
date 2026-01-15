# E-Learning Platform

A comprehensive, production-ready e-learning application demonstrating modern full-stack development, security best practices, and real-world features.

## Features

### Public Features
- **Course Browsing**: Filter by category, difficulty level, and search
- **Course Details**: View syllabus, lessons, instructor info, and course overview
- **Landing Page**: Marketing-focused homepage with feature highlights

### User Features
- **Authentication**: Secure JWT-based signup and login
- **Enrollment**: Enroll in courses with one click
- **Dashboard**: Track enrolled courses and learning progress
- **Progress Tracking**: Monitor completion percentage for each course
- **Lesson Access**: View course content and lessons

### Admin Features
- **Course Management**: Create, edit, and delete courses
- **Lesson Management**: Add multiple lessons with content and videos
- **User Management**: View all users and their enrollments
- **Analytics**: Track enrollment statistics and user progress

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Express validators
- **CORS**: Cross-Origin Resource Sharing

### Deployment
- **Frontend**: Vercel
- **Backend**: Render or Heroku
- **Database**: MongoDB Atlas

## Project Structure

```
E-Learning-Platform/
├── frontend/
│   ├── src/
│   │   ├── api/          # API client configuration
│   │   ├── components/   # Reusable components (Header, Footer, CourseCard, etc.)
│   │   ├── pages/        # Page components (Landing, Courses, Dashboard, Admin, etc.)
│   │   ├── store/        # Zustand state management
│   │   ├── App.jsx       # Main app component
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global styles
│   ├── index.html        # HTML template
│   ├── vite.config.js    # Vite configuration
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.example
│
└── backend/
    ├── config/
    │   └── db.js         # MongoDB connection
    ├── models/
    │   ├── User.js       # User schema
    │   ├── Course.js     # Course schema
    │   └── Enrollment.js # Enrollment schema
    ├── controllers/
    │   ├── authController.js      # Auth logic
    │   ├── courseController.js    # Course CRUD
    │   └── enrollmentController.js # Enrollment logic
    ├── middleware/
    │   ├── authMiddleware.js  # JWT verification
    │   └── adminMiddleware.js # Admin authorization
    ├── routes/
    │   ├── authRoutes.js      # Auth endpoints
    │   ├── courseRoutes.js    # Course endpoints
    │   └── enrollmentRoutes.js # Enrollment endpoints
    ├── server.js         # Express server setup
    ├── package.json
    └── .env.example
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account
- Git

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

4. **Configure environment variables:**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/elearning
   JWT_SECRET=your_secure_jwt_secret_key_here
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
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Courses
- `GET /api/courses` - Get all courses (with filters)
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)

### Enrollments
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments/me` - Get user enrollments
- `PUT /api/enrollments/:id/progress` - Update progress
- `GET /api/enrollments` - Get all enrollments (admin only)

## Data Models

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  passwordHash: String,
  role: String ('user' | 'admin'),
  createdAt: Date
}
```

### Course
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String (unique),
  description: String,
  price: Number,
  category: String,
  difficulty: String,
  instructor: String,
  thumbnailUrl: String,
  lessons: [
    {
      _id: ObjectId,
      title: String,
      contentHtml: String,
      videoUrl: String,
      order: Number
    }
  ],
  createdAt: Date
}
```

### Enrollment
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  courseId: ObjectId,
  progress: Map<lessonId, Boolean>,
  progressPercentage: Number,
  enrolledAt: Date,
  completedAt: Date
}
```

## User Flows

### Sign Up & Enroll
1. User visits landing page
2. Clicks "Explore Courses"
3. Browses course catalog with filters
4. Clicks on course to view details
5. Clicks "Sign Up to Enroll" → redirected to signup
6. Creates account
7. Returns to course and clicks "Enroll Now"
8. Course appears in dashboard

### Learning
1. User logs in
2. Views dashboard with enrolled courses
3. Clicks "Continue Learning"
4. Views course lessons
5. Progress tracked and displayed
6. After completing all lessons, course marked as complete

### Admin Management
1. Admin logs in
2. Navigates to admin panel
3. Creates new course with lessons
4. Views user enrollments
5. Manages course content (edit/delete)

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Admin and user-only endpoints
- **Input Validation**: Server-side validation
- **CORS**: Properly configured cross-origin requests
- **Environment Variables**: Sensitive data in .env files
- **HTTP-Only Cookies**: Optional for token storage

## Testing

### Frontend Tests
```bash
npm run test
```

### Backend Tests
```bash
npm run test
```

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variable:
   ```
   VITE_API_URL=https://your-backend-url/api
   ```
4. Deploy

### Backend (Render)

1. Create Render account
2. Connect GitHub repo
3. Set environment variables:
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_secret
   NODE_ENV=production
   ```
4. Deploy

### Database (MongoDB Atlas)

1. Create cluster
2. Create database user
3. Configure IP whitelist
4. Get connection string
5. Use in `MONGO_URI`

## Development Guidelines

### Code Style
- Use ES6+ features
- Follow naming conventions
- Write meaningful comments
- Keep functions small and focused

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/feature-name

# Commit changes
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/feature-name
```

### Environment Variables
Never commit `.env` files. Use `.env.example` as template.

## Stretch Goals

- [ ] Payment integration (Stripe test mode)
- [ ] Video streaming with AWS S3
- [ ] Course recommendations
- [ ] Discussion forums
- [ ] Certificate generation
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Social login (Google, GitHub)
- [ ] Course reviews and ratings

## Troubleshooting

### MongoDB Connection Error
- Check connection string
- Verify IP whitelist in Atlas
- Confirm credentials

### CORS Errors
- Check CORS configuration in server.js
- Verify frontend URL in allowed origins

### JWT Token Errors
- Clear localStorage
- Verify JWT_SECRET matches
- Check token expiration

### Port Already in Use
```bash
# Kill process on port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

## Learning Outcomes

By completing this project, you'll have:
- Built a full-stack web application
- Implemented secure authentication
- Designed database schemas
- Created RESTful APIs
- Built responsive UI with React
- Deployed applications to production
- Practiced security best practices
- Managed state in complex applications

## License

ISC

## Support

For issues and questions:
1. Check documentation
2. Review GitHub issues
3. Contact development team

---

**Version**: 1.0.0  
**Last Updated**: January 2026
