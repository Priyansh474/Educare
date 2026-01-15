# Deployment Guide for E-Learning Platform

## Table of Contents
- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
- [Backend Deployment (Render)](#backend-deployment-render)
- [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
- [Post-Deployment Verification](#post-deployment-verification)

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free tier available)
- GitHub repository

### Steps

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select GitHub repository
   - Choose `frontend` as root directory

3. **Set Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://your-backend-domain.onrender.com/api
     ```

4. **Deploy**
   - Vercel automatically deploys on push to main branch
   - Frontend URL will be provided

### Verify Deployment
```bash
# Check that your site is accessible
curl https://your-vercel-domain.com
```

## Backend Deployment (Render)

### Prerequisites
- Render account (free tier available)
- GitHub repository

### Steps

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Create Web Service on Render**
   - Go to [render.com](https://render.com)
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repository
   - Select `backend` directory

3. **Configure Build Settings**
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`

4. **Set Environment Variables**
   - Add in Render dashboard:
     ```
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/elearning
     JWT_SECRET=your_super_secret_jwt_key_here
     NODE_ENV=production
     PORT=5000
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Backend URL will be provided

### Enable CORS for Production
Update `server.js`:
```javascript
app.use(cors({
  origin: [
    'https://your-vercel-domain.com',
    'http://localhost:3000' // for development
  ],
  credentials: true
}));
```

## Database Setup (MongoDB Atlas)

### Prerequisites
- MongoDB Atlas account (free tier available)

### Steps

1. **Create Cluster**
   - Log in to MongoDB Atlas
   - Click "Create" to build a database
   - Choose "Shared" (free) cluster
   - Select region (closest to you)
   - Click "Create Cluster"

2. **Create Database User**
   - In cluster view, click "Security" → "Database Access"
   - Click "Add New Database User"
   - Username: `elearning_user`
   - Password: (generate strong password)
   - Click "Add User"

3. **Configure IP Whitelist**
   - Click "Security" → "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" for development
   - For production, add specific IPs:
     - Render IP (check Render dashboard)
     - Your office/home IP
   - Click "Confirm"

4. **Get Connection String**
   - Click "Connect"
   - Select "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password
   - Example:
     ```
     mongodb+srv://elearning_user:PASSWORD@cluster.mongodb.net/elearning?retryWrites=true&w=majority
     ```

5. **Create Database**
   - Click "Clusters"
   - Select your cluster
   - Click "Collections"
   - Click "Create Database"
   - Database name: `elearning`
   - Collection name: `users`

### Verify Connection
```bash
# Test connection from backend
npm run dev
# Check console for "MongoDB Connected"
```

## Post-Deployment Verification

### 1. Test API Endpoints

```bash
# Health Check
curl https://your-backend-domain.onrender.com/health

# Signup
curl -X POST https://your-backend-domain.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Courses
curl https://your-backend-domain.onrender.com/api/courses
```

### 2. Test Frontend Features

- [ ] Home page loads
- [ ] Can browse courses
- [ ] Can search and filter courses
- [ ] Can sign up new account
- [ ] Can log in
- [ ] Can enroll in course
- [ ] Dashboard displays enrolled courses
- [ ] Can view course details
- [ ] Admin can create course (if admin)

### 3. Check Environment Variables

Verify all env vars are set:
- Backend: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV`, `PORT`
- Frontend: `VITE_API_URL`

### 4. Monitor Logs

**Render Backend Logs:**
- Go to Render dashboard
- Select your service
- Click "Logs" tab

**Vercel Frontend Logs:**
- Go to Vercel dashboard
- Select your project
- Click "Deployments"

## Troubleshooting

### MongoDB Connection Error

**Problem:** `Error: connect ECONNREFUSED`

**Solutions:**
1. Check IP whitelist in MongoDB Atlas
2. Verify connection string in env vars
3. Check database user credentials
4. Ensure cluster is running

### CORS Errors

**Problem:** `Cross-Origin Request Blocked`

**Solutions:**
1. Update CORS configuration in backend
2. Check that frontend URL is whitelisted
3. Verify API URL in frontend env vars

### Environment Variables Not Working

**Problem:** `undefined` when accessing env vars

**Solutions:**
1. Verify env vars are set in deployment platform
2. For frontend, ensure vars start with `VITE_`
3. Redeploy after changing env vars
4. Check spelling of variable names

### Vercel Build Fails

**Check:**
- Node version compatibility
- Missing dependencies in package.json
- Build script output
- Environment variables for build

### Render Deployment Fails

**Check:**
- Start command is correct
- No errors in build logs
- All dependencies installed
- Port 5000 not in use

## Monitoring & Maintenance

### Set Up Monitoring

1. **Backend Health Checks**
   - Render automatically pings `/health` endpoint
   - Add alerts to Render dashboard

2. **Database Backups**
   - Enable automatic backups in MongoDB Atlas
   - Store backups securely

3. **Error Tracking**
   - Add error logging service (optional)
   - Monitor logs regularly

### Regular Maintenance

- Review logs weekly
- Check error rates
- Update dependencies monthly
- Test recovery procedures

## Rollback Procedures

### Vercel Rollback
1. Go to Deployments tab
2. Click on previous deployment
3. Click "Redeploy"

### Render Rollback
1. Go to your service
2. Click "Manual Deploy"
3. Select previous Git commit

## Performance Optimization

### Frontend (Vercel)
- Enable automatic compression
- Use image optimization
- Minimize JavaScript bundles

### Backend (Render)
- Monitor response times
- Optimize database queries
- Use caching when appropriate

---

**Last Updated:** January 2026  
**Status:** Production Ready
