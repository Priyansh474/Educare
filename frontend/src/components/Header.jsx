import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/courses') {
      return location.pathname === '/courses' || location.pathname.startsWith('/courses/');
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F3F7F4] border-b border-gray-100">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">Educare</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Navigation Links */}
          <nav className="hidden md:flex gap-3 items-center">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                isActive('/')
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                  : 'text-gray-800 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/courses"
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                isActive('/courses') || isActive('/courses/')
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                  : 'text-gray-800 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              Courses
            </Link>
          </nav>

          {/* User Menu */}
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className="text-gray-800 hover:text-emerald-700 font-medium text-sm">
                  Admin
                </Link>
              ) : (
                <Link to="/dashboard" className="text-gray-800 hover:text-emerald-700 font-medium text-sm">
                  Dashboard
                </Link>
              )}
              <span 
                className="text-sm font-semibold text-emerald-600 transition-all duration-300"
                style={{ textShadow: '0 0 10px rgba(16, 185, 129, 0.6), 0 0 20px rgba(16, 185, 129, 0.4)' }}
              >
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-emerald-700 border border-emerald-700 rounded-full font-semibold hover:bg-emerald-50 transition text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-full border border-emerald-700 text-emerald-700 font-semibold text-sm hover:bg-emerald-50 transition"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

