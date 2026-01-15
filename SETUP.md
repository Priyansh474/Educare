# E-Learning Platform - Setup Guide

Complete step-by-step instructions to get the E-Learning Platform running on your machine.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)
7. [Seeding Sample Data](#seeding-sample-data)
8. [Testing](#testing)
9. [Common Issues](#common-issues)

## Prerequisites

Before starting, ensure you have:

- **Git**: [Download here](https://git-scm.com/)
- **Node.js 16+**: [Download here](https://nodejs.org/)
- **npm 8+** (comes with Node.js)
- **MongoDB Atlas account**: [Free account](https://www.mongodb.com/cloud/atlas)
- **Code editor**: VS Code, WebStorm, or similar
- **Terminal/Command Prompt**: PowerShell, Command Prompt, or Bash

### Verify Installation

```bash
# Check Node.js
node --version    # Should be v16 or higher

# Check npm
npm --version     # Should be 8 or higher

# Check Git
git --version     # Should show version
```

## Project Structure

```
E-Learning-Platform/
├── backend/              # Express.js API server
│   ├── config/          # Database configuration
│   ├── models/          # MongoDB schemas (User, Course, Enrollment)
│   ├── controllers/     # Business logic
│   ├── middleware/      # Authentication, authorization
│   ├── routes/          # API endpoints
│   ├── server.js        # Express app entry point
│   ├── seed.js          # Database seeding script
│   ├── package.json     # Dependencies
│   └── .env.example     # Environment variables template
│
└── frontend/             # React.js UI application
    ├── src/
    │   ├── api/         # API client
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── store/       # State management
    │   ├── App.jsx      # Root component
    │   └── index.css    # Global styles
    ├── index.html       # HTML template
    ├── vite.config.js   # Vite configuration
    ├── package.json     # Dependencies
    └── .env.example     # Environment variables template
```

## Database Setup

### Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Start Free"
3. Create account with email or Google
4. Verify email

### Create Cluster

1. After login, click "Build a Database"
2. Choose "Shared" (Free tier)
3. Select cloud provider and region
4. Click "Create Cluster" (takes 1-2 minutes)

### Create Database User

1. Click your cluster
2. Go to "Security" → "Database Access"
3. Click "Add New Database User"
4. **Username:** `elearning_user`
5. **Password:** Create strong password (save it!)
6. Click "Add User"

### Configure Network Access

1. Go to "Security" → "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - For production, add specific IPs only
4. Click "Confirm"

### Get Connection String

1. Click "Clusters"
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your password

**Example:**
```
mongodb+srv://elearning_user:YOUR_PASSWORD@cluster.mongodb.net/elearning?retryWrites=true&w=majority
```

## Backend Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/E-Learning-Platform.git
cd E-Learning-Platform
```

### 2. Navigate to Backend

```bash
cd backend
```

### 3. Install Dependencies

```bash
npm install
```

Expected output:
```
added 45 packages in 12s
```

### 4. Create Environment File

```bash
# Copy example file
cp .env.example .env
```

### 5. Configure Environment Variables

Open `.env` in your editor and update:

```env
# MongoDB connection string from Atlas
MONGO_URI=mongodb+srv://elearning_user:PASSWORD@cluster.mongodb.net/elearning?retryWrites=true&w=majority

# Generate a random string for JWT
# Use any secure string, e.g., from https://www.random.org/strings/
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server port
PORT=5000

# Node environment
NODE_ENV=development
```

### 6. Verify Backend Setup

```bash
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB Connected: cluster.mongodb.net
```

Press `Ctrl+C` to stop the server.

## Frontend Setup

### 1. Navigate to Frontend

```bash
# From project root
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

```bash
cp .env.example .env.local
```

### 4. Configure Environment Variables

Open `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Verify Frontend Setup

```bash
npm run dev
```

Expected output:
```
VITE v5.0.8  ready in 234 ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

Visit `http://localhost:3000` in your browser. You should see the landing page.

Press `Ctrl+C` to stop the dev server.

## Running the Application

### Terminal 1: Backend Server

```bash
cd E-Learning-Platform/backend
npm run dev
```

Monitor output for:
```
Server running on port 5000
MongoDB Connected: [cluster name]
```

### Terminal 2: Frontend Dev Server

```bash
cd E-Learning-Platform/frontend
npm run dev
```

Monitor output for:
```
Local:   http://localhost:3000/
```

### Terminal 3: (Optional) For Seeding Database

See [Seeding Sample Data](#seeding-sample-data) section.

### Access the Application

Open browser and go to: `http://localhost:3000`

You should see:
- Landing page with "Explore Courses" button
- Navigation bar with Courses, Login, Signup links
- Footer with links

## Seeding Sample Data

To populate the database with sample courses and users:

### 1. Start Backend Server

```bash
cd backend
npm run dev
```

Keep this running in one terminal.

### 2. Run Seed Script

In a new terminal:

```bash
cd backend
node seed.js
```

Expected output:
```
Connected to MongoDB
Cleared existing data
Created users
Created courses
✓ Database seeded successfully

📊 Statistics:
- Users created: 3
- Courses created: 8

👤 Test Accounts:
Admin - Email: admin@example.com, Password: password123
User  - Email: john@example.com, Password: password123
```

### 3. Verify Seeding

1. Go to `http://localhost:3000/courses`
2. You should see 8 courses displayed
3. Try searching or filtering

### Test Accounts

**Admin User:**
- Email: `admin@example.com`
- Password: `password123`
- Access: Full admin panel at `/admin`

**Regular User:**
- Email: `john@example.com`
- Password: `password123`
- Access: User dashboard at `/dashboard`

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run specific test file
npm test tests/api.test.js

# Run with coverage
npm test -- --coverage
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

### Manual Testing Checklist

#### Authentication
- [ ] Sign up with new email
- [ ] Try signing up with duplicate email (should fail)
- [ ] Log in with correct credentials
- [ ] Try logging in with wrong password (should fail)
- [ ] Logout and verify redirect

#### Courses
- [ ] Browse all courses on `/courses`
- [ ] Search for course by title
- [ ] Filter by category
- [ ] Filter by difficulty
- [ ] View course details
- [ ] Verify course has lessons listed

#### Enrollment & Dashboard
- [ ] (As logged-in user) Enroll in a course
- [ ] Verify course appears in dashboard
- [ ] Check progress bar (should be 0%)
- [ ] Try enrolling in same course again (should fail)

#### Admin Features
- [ ] (As admin) Go to `/admin`
- [ ] Create new course with lessons
- [ ] Edit existing course
- [ ] Delete course
- [ ] View enrollments
- [ ] Verify non-admin users can't access admin panel

## Common Issues

### Issue: "Cannot find module 'dotenv'"

**Solution:**
```bash
cd backend
npm install dotenv
```

### Issue: "MongoDB Connection Error"

**Check:**
1. MongoDB URI is correct in `.env`
2. Username and password are correct
3. IP whitelist includes your IP in MongoDB Atlas
4. Network connectivity (try pinging mongodb.com)

**Solution:**
```bash
# Test connection
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected!'))
  .catch(err => console.error(err))
"
```

### Issue: "CORS Error" or "API not found"

**Solution:**
1. Verify backend is running on port 5000
2. Check frontend `VITE_API_URL` is correct
3. Check network tab in browser dev tools
4. Verify CORS is enabled in `server.js`

### Issue: "Port 5000 already in use"

**macOS/Linux:**
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

**Windows (PowerShell):**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: "npm modules not installing"

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: "Build fails" (Frontend)

**Solutions:**
```bash
# Check for syntax errors
npm run build

# Clear Vite cache
rm -rf node_modules/.vite

# Reinstall
npm install
npm run build
```

### Issue: "Can't login/authentication failing"

**Check:**
1. JWT_SECRET is set in backend `.env`
2. Token is being stored in localStorage
3. Check browser console for errors
4. Verify user exists in database

### Issue: "Tests failing"

**Solution:**
```bash
# Update Jest/test setup
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Clear Jest cache
npm test -- --clearCache

# Run tests again
npm test
```

## Next Steps

After successful setup:

1. **Explore the Code**
   - Read comments in controllers
   - Understand data models in `models/`
   - Study authentication flow

2. **Make a Feature**
   - Add course reviews
   - Implement course ratings
   - Add progress tracking visualization

3. **Deploy** (See [DEPLOYMENT.md](./DEPLOYMENT.md))
   - Deploy backend to Render
   - Deploy frontend to Vercel
   - Connect to MongoDB Atlas

4. **Learn More**
   - MongoDB documentation
   - Express.js guide
   - React best practices
   - REST API design

## Support & Resources

- **Backend Issues**: Check `backend/README.md`
- **Frontend Issues**: Check `frontend/README.md`
- **Deployment Issues**: Check `DEPLOYMENT.md`
- **API Documentation**: See README.md

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: Ready for Development
