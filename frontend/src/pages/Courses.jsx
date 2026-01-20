import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import { courseAPI, enrollmentAPI } from '../api/client';
import { useAuthStore } from '../store/authStore';

export default function Courses() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchEnrolledCourses();
    }
  }, [filters, currentPage, user]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await courseAPI.getCourses({
        ...filters,
        page: currentPage,
        limit: 12,
      });
      // Backend returns: { success: true, message: '...', data: { courses, pages, ... } }
      const responseData = response.data;
      const coursesData = responseData.data || responseData; // Handle both formats
      setCourses(coursesData.courses || []);
      setTotalPages(coursesData.pages || 1);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch courses';
      setError(errorMessage);
      console.error('Error fetching courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await enrollmentAPI.getMyEnrollments();
      // Backend returns: { success: true, message: '...', data: { enrollments, ... } }
      const responseData = response.data;
      const enrollmentsData = responseData.data || responseData; // Handle both formats
      const enrollments = enrollmentsData.enrollments || [];
      const enrolled = new Set(enrollments.map((e) => {
        const courseId = e.courseId?._id || e.courseId || e.courseId;
        return courseId?.toString();
      }).filter(Boolean));
      setEnrolledCourses(enrolled);
    } catch (err) {
      console.error('Failed to fetch enrollments:', err);
      // Don't show error for enrollments, just log it
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleEnroll = (courseId) => {
    setEnrolledCourses((prev) => new Set([...prev, courseId]));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Explore Courses</h1>
        <p className="text-emerald-200 mb-8 text-lg">
          Discover curated courses to grow your skills and career
        </p>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-slate-900/60 backdrop-blur-sm p-6 rounded-xl border border-emerald-700/40">
        <div>
          <label className="block text-sm font-semibold mb-2 text-emerald-100">Search</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search courses..."
            className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg text-emerald-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-emerald-100">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg text-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">All Categories</option>
            <option value="programming" className="bg-slate-900">
              Programming
            </option>
            <option value="design" className="bg-slate-900">
              Design
            </option>
            <option value="business" className="bg-slate-900">
              Business
            </option>
            <option value="marketing" className="bg-slate-900">
              Marketing
            </option>
            <option value="data-science" className="bg-slate-900">
              Data Science
            </option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-emerald-100">Difficulty</label>
          <select
            name="difficulty"
            value={filters.difficulty}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-lg text-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">All Levels</option>
            <option value="beginner" className="bg-slate-900">
              Beginner
            </option>
            <option value="intermediate" className="bg-slate-900">
              Intermediate
            </option>
            <option value="advanced" className="bg-slate-900">
              Advanced
            </option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => setFilters({ category: '', difficulty: '', search: '' })}
            className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition border border-emerald-400"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-emerald-100 text-lg">Loading courses...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/70 text-red-200 px-4 py-3 rounded-lg mb-8 backdrop-blur-sm">
          {error}
        </div>
      )}

      {/* Courses Grid */}
      {!isLoading && courses.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isEnrolled={enrolledCourses.has(course._id)}
                onEnroll={handleEnroll}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-slate-900/70 border border-slate-700 text-emerald-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition ${
                    currentPage === page
                      ? 'bg-emerald-500 text-white border border-emerald-400'
                      : 'bg-slate-900/70 border border-slate-700 text-emerald-50 hover:bg-slate-800'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-slate-900/70 border border-slate-700 text-emerald-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && courses.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-emerald-100 text-lg">No courses found matching your filters</p>
        </div>
      )}
      </div>
    </div>
  );
}
