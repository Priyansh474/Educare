import React, { useState, useEffect } from 'react';
import { courseAPI, enrollmentAPI } from '../api/client';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('create');
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'programming',
    difficulty: 'beginner',
    instructor: '',
    lessons: [{ title: '', contentHtml: '', videoUrl: '', order: 1 }],
  });

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchCourses();
    } else if (activeTab === 'enrollments') {
      fetchEnrollments();
    }
  }, [activeTab]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await courseAPI.getCourses({ limit: 100 });
      // Backend returns: { success: true, message: '...', data: { courses, ... } }
      const responseData = response.data;
      const coursesData = responseData.data || responseData;
      setCourses(coursesData.courses || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch courses';
      alert(errorMessage);
      console.error('Error fetching courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await enrollmentAPI.getAllEnrollments();
      // Backend returns: { success: true, message: '...', data: { enrollments, ... } }
      const responseData = response.data;
      const enrollmentsData = responseData.data || responseData;
      const fetchedEnrollments = enrollmentsData.enrollments || [];
      setEnrollments(fetchedEnrollments);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch enrollments';
      setError(errorMessage);
      console.error('Error fetching enrollments:', err);
      setEnrollments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLessonChange = (index, field, value) => {
    const newLessons = [...formData.lessons];
    newLessons[index] = { ...newLessons[index], [field]: value };
    setFormData((prev) => ({ ...prev, lessons: newLessons }));
  };

  const addLesson = () => {
    setFormData((prev) => ({
      ...prev,
      lessons: [
        ...prev.lessons,
        { title: '', contentHtml: '', videoUrl: '', order: prev.lessons.length + 1 },
      ],
    }));
  };

  const removeLesson = (index) => {
    setFormData((prev) => ({
      ...prev,
      lessons: prev.lessons.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingCourse) {
        await courseAPI.updateCourse(editingCourse._id, formData);
        alert('Course updated successfully');
      } else {
        await courseAPI.createCourse(formData);
        alert('Course created successfully');
      }

      setFormData({
        title: '',
        description: '',
        price: '',
        category: 'programming',
        difficulty: 'beginner',
        instructor: '',
        lessons: [{ title: '', contentHtml: '', videoUrl: '', order: 1 }],
      });
      setEditingCourse(null);
      setActiveTab('manage');
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      category: course.category,
      difficulty: course.difficulty,
      instructor: course.instructor,
      lessons: course.lessons.length > 0 ? course.lessons : [{ title: '', contentHtml: '', videoUrl: '', order: 1 }],
    });
    setActiveTab('create');
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await courseAPI.deleteCourse(courseId);
      alert('Course deleted successfully');
      fetchCourses();
    } catch (err) {
      alert('Failed to delete course');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            activeTab === 'create'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {editingCourse ? 'Edit Course' : 'Create Course'}
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            activeTab === 'manage'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Manage Courses
        </button>
        <button
          onClick={() => setActiveTab('enrollments')}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            activeTab === 'enrollments'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Enrollments
        </button>
      </div>

      {/* Create/Edit Course */}
      {activeTab === 'create' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Instructor</label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
                <option value="data-science">Data Science</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Lessons */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4">Lessons</h3>
            {formData.lessons.map((lesson, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Lesson Title</label>
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Video URL</label>
                    <input
                      type="text"
                      value={lesson.videoUrl || ''}
                      onChange={(e) => handleLessonChange(index, 'videoUrl', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Content (HTML)</label>
                  <textarea
                    value={lesson.contentHtml}
                    onChange={(e) => handleLessonChange(index, 'contentHtml', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                {formData.lessons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLesson(index)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Remove Lesson
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addLesson}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              + Add Lesson
            </button>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
            </button>
            {editingCourse && (
              <button
                type="button"
                onClick={() => {
                  setEditingCourse(null);
                  setFormData({
                    title: '',
                    description: '',
                    price: '',
                    category: 'programming',
                    difficulty: 'beginner',
                    instructor: '',
                    lessons: [{ title: '', contentHtml: '', videoUrl: '', order: 1 }],
                  });
                }}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* Manage Courses */}
      {activeTab === 'manage' && (
        <div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course._id} className="bg-white rounded-lg shadow p-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{course.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{course.instructor}</p>
                    <p className="text-sm text-gray-500 mt-2">${course.price} • {course.difficulty}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Enrollments */}
      {activeTab === 'enrollments' && (
        <div>
          {isLoading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">Loading enrollments...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 font-semibold mb-2">Error loading enrollments</p>
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={fetchEnrollments}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">No enrollments found</p>
              <p className="text-gray-500 text-sm">There are no course enrollments in the system yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Enrollments: {enrollments.length}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Student</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Course</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Progress</th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-700">Enrolled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((enrollment) => {
                      const user = enrollment.userId || {};
                      const course = enrollment.courseId || {};
                      const progress = enrollment.progressPercentage || 0;
                      
                      return (
                        <tr key={enrollment._id || enrollment.id} className="border-t hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-800">{user.name || 'Unknown User'}</p>
                            <p className="text-sm text-gray-600">{user.email || 'N/A'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-800">{course.title || 'Unknown Course'}</p>
                            {course.category && (
                              <p className="text-sm text-gray-500">{course.category}</p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mb-1">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600">{Math.round(progress)}%</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {enrollment.enrolledAt
                              ? new Date(enrollment.enrolledAt).toLocaleDateString()
                              : 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
