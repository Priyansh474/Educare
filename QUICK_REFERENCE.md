# E-Learning Platform - Quick Reference

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Setup MongoDB
- Create account: https://www.mongodb.com/cloud/atlas
- Create cluster → Create user → Get connection string

### 3. Configure Environment
```bash
# Backend
cat > backend/.env << EOF
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/elearning
JWT_SECRET=supersecretkey12345
PORT=5000
NODE_ENV=development
EOF

# Frontend
cat > frontend/.env.local << EOF
VITE_API_URL=http://localhost:5000/api
EOF
```

### 4. Start Servers
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### 5. Open Browser
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/health

---

## 📁 Key Files

### Backend
- `server.js` - Express app
- `seed.js` - Sample data
- `config/db.js` - Database connection
- `models/` - Database schemas
- `controllers/` - Business logic
- `routes/` - API endpoints

### Frontend
- `App.jsx` - Router setup
- `pages/` - Page components
- `components/` - Reusable components
- `api/client.js` - API calls
- `store/authStore.js` - Auth state

---

## 🔌 API Endpoints

```
# Auth
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me

# Courses
GET    /api/courses
GET    /api/courses/:id
POST   /api/courses (admin)
PUT    /api/courses/:id (admin)
DELETE /api/courses/:id (admin)

# Enrollments
POST   /api/enrollments
GET    /api/enrollments/me
PUT    /api/enrollments/:id/progress
GET    /api/enrollments (admin)
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Seed data
cd backend && node seed.js
```

---

## 👤 Test Accounts

After seeding:
- **Admin**: admin@example.com / password123
- **User**: john@example.com / password123

---

## 📱 Routes

```
/                   Landing page
/courses            Course listing
/courses/:slug      Course detail
/login              Login
/signup             Sign up
/dashboard          User dashboard
/admin              Admin panel
```

---

## 🔐 Security

- Passwords hashed with bcrypt
- JWT tokens (7 days expiry)
- Admin-only routes protected
- Input validation on server
- CORS configured

---

## 🌐 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📚 Documentation

- **README.md** - Overview & features
- **SETUP.md** - Installation guide
- **DEPLOYMENT.md** - Deploy to production
- **PROJECT_SUMMARY.md** - What was built

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process or change PORT env var |
| MongoDB connection error | Check MONGO_URI and IP whitelist |
| CORS error | Verify API URL in frontend env |
| Tests failing | Run `npm install` and clear cache |

---

## 📦 NPM Scripts

### Backend
```bash
npm run dev      # Start with nodemon
npm test         # Run tests
npm run seed     # Seed database
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm test         # Run tests
```

---

## 🚀 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect repo to Vercel
3. Set `VITE_API_URL` env var
4. Deploy

### Backend (Render)
1. Push to GitHub
2. Create Web Service on Render
3. Set `MONGO_URI` and `JWT_SECRET`
4. Deploy

See **DEPLOYMENT.md** for detailed steps

---

## 📊 Project Stats

- **Backend**: Express, MongoDB, JWT
- **Frontend**: React, Vite, Tailwind
- **Routes**: 7 unique pages
- **API Endpoints**: 12 total
- **Database Models**: 3
- **Sample Courses**: 8
- **Test Accounts**: 2+

---

## ✅ Checklist

- [ ] Dependencies installed
- [ ] MongoDB setup complete
- [ ] Environment variables set
- [ ] Backend running (npm run dev)
- [ ] Frontend running (npm run dev)
- [ ] Database seeded (node seed.js)
- [ ] Can signup/login
- [ ] Can view courses
- [ ] Can enroll in course
- [ ] Can see dashboard
- [ ] Admin panel accessible

---

## 🎓 Learning Path

1. Read README.md - understand the project
2. Follow SETUP.md - get it running
3. Explore the code - understand structure
4. Run tests - see how it works
5. Try features - signup, enroll, admin
6. Deploy with DEPLOYMENT.md
7. Extend with new features

---

## 📞 Support

- **Issues**: Check SETUP.md troubleshooting
- **Deploy Issues**: Check DEPLOYMENT.md
- **API Issues**: Check README.md endpoints
- **Code Questions**: Read comments and structure

---

**Version**: 1.0.0  
**Status**: Production Ready  
**Last Updated**: January 2026
