import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { enrollmentAPI } from '../api/client';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setIsLoading(true);
      const response = await enrollmentAPI.getMyEnrollments();
      // Backend returns: { success: true, message: '...', data: { enrollments, count } }
      const responseData = response.data;
      const enrollmentsData = responseData.data || responseData;
      const fetchedEnrollments = enrollmentsData.enrollments || [];
      
      setEnrollments(fetchedEnrollments);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch enrollments';
      setError(errorMessage);
      console.error('Error fetching enrollments:', err);
      setEnrollments([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-slate-300 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">Welcome, {user?.name || 'User'}!</h1>
          <p className="text-slate-300 text-lg">Track your learning progress</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl shadow-lg">
            <h3 className="text-slate-300 text-sm font-semibold mb-2 uppercase tracking-wide">Enrolled Courses</h3>
            <p className="text-4xl font-bold text-emerald-400">{enrollments.length}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl shadow-lg">
            <h3 className="text-slate-300 text-sm font-semibold mb-2 uppercase tracking-wide">In Progress</h3>
            <p className="text-4xl font-bold text-yellow-400">
              {enrollments.filter((e) => {
                const progress = e.progressPercentage || 0;
                return progress > 0 && progress < 100;
              }).length}
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl shadow-lg">
            <h3 className="text-slate-300 text-sm font-semibold mb-2 uppercase tracking-wide">Completed</h3>
            <p className="text-4xl font-bold text-emerald-500">
              {enrollments.filter((e) => (e.progressPercentage || 0) === 100).length}
            </p>
          </div>
        </div>

      {/* Enrolled Courses */}
      <div>
        <h2 className="text-3xl font-bold mb-6 text-white">Your Courses</h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-8 backdrop-blur-sm">
            {error}
          </div>
        )}

        {enrollments.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-lg p-12 text-center">
            <p className="text-slate-300 mb-6 text-lg">You haven't enrolled in any courses yet</p>
            <Link
              to="/courses"
              className="inline-block bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => {
              const course = enrollment.courseId || enrollment.course;
              if (!course) return null;

              const courseId = course._id || course.id;
              const courseSlug = course.slug || courseId;
              const progress = enrollment.progressPercentage || 0;
              const isCompleted = progress === 100;

              return (
                <div
                  key={enrollment._id || enrollment.id}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:border-emerald-500/50 transition-all"
                >
                  {/* Course Image */}
                  {course.thumbnailUrl && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-800/50 to-transparent"></div>
                      {isCompleted && (
                        <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          ✓ Completed
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    {/* Category & Difficulty */}
                    <div className="flex items-center gap-2 mb-3">
                      {course.category && (
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded">
                          {course.category.toUpperCase()}
                        </span>
                      )}
                      {course.difficulty && (
                        <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs font-semibold rounded">
                          {course.difficulty}
                        </span>
                      )}
                    </div>

                    {/* Course Title */}
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {course.title || 'Untitled Course'}
                    </h3>

                    {/* Description */}
                    {course.description && (
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300 font-semibold">Progress</span>
                        <span className="text-sm text-emerald-400 font-bold">{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/courses/${courseSlug}`}
                      className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center py-2.5 rounded-lg font-semibold transition-colors"
                    >
                      {isCompleted ? 'Review Course' : 'Continue Learning'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
