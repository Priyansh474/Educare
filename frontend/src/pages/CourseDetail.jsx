import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseAPI, enrollmentAPI } from '../api/client';
import { useAuthStore } from '../store/authStore';
import VideoPlayer from '../components/VideoPlayer';
import PaymentModal from '../components/PaymentModal';

export default function CourseDetail() {
  const { slug } = useParams();
  const { user, token } = useAuthStore();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState('not-enrolled');
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  useEffect(() => {
    if (user && token && course) {
      checkEnrollmentStatus();
    }
  }, [user, token, course]);

  const fetchCourse = async () => {
    try {
      setIsLoading(true);
      const response = await courseAPI.getCourse(slug);
      // Backend returns: { success: true, message: '...', data: { course } }
      const responseData = response.data;
      const courseData = responseData.data || responseData;
      setCourse(courseData.course || courseData);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch course details';
      setError(errorMessage);
      console.error('Error fetching course:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      const response = await enrollmentAPI.getMyEnrollments();
      // Backend returns: { success: true, message: '...', data: { enrollments } }
      const responseData = response.data;
      const enrollmentsData = responseData.data || responseData;
      const enrollments = enrollmentsData.enrollments || [];
      const courseId = course?._id || course?.id;
      const isEnrolled = enrollments.some((e) => {
        const enrolledCourseId = e.courseId?._id || e.courseId?.id || e.courseId;
        return enrolledCourseId?.toString() === courseId?.toString();
      });
      setEnrollmentStatus(isEnrolled ? 'enrolled' : 'not-enrolled');
    } catch (err) {
      console.error('Failed to check enrollment status:', err);
    }
  };

  const handlePurchaseClick = () => {
    if (!user) {
      return alert('Please login to purchase this course');
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      setEnrollLoading(true);
      const courseId = course._id || course.id;
      if (!courseId) {
        throw new Error('Course ID not found');
      }
      await enrollmentAPI.enroll(courseId);
      setEnrollmentStatus('enrolled');
      setIsPaymentModalOpen(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to enroll';
      alert(errorMessage);
      console.error('Enrollment error:', err);
    } finally {
      setEnrollLoading(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-600">{error || 'Course not found'}</p>
      </div>
    );
  }

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <Link to="/courses" className="text-blue-100 hover:text-white mb-4 inline-block">
            ← Back to Courses
          </Link>
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <div className="flex gap-4 items-center">
            <span className={`text-sm px-3 py-1 rounded-full ${difficultyColors[course.difficulty]}`}>
              {course.difficulty}
            </span>
            <span className="text-gray-100">{course.category}</span>
            <span className="text-gray-100">By {course.instructor}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Course Overview</h2>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Course Content ({course.lessons.length} lessons)</h2>
              <div className="bg-white rounded-lg shadow">
                {course.lessons.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No lessons available yet.
                  </div>
                ) : (
                  course.lessons
                    .sort((a, b) => a.order - b.order)
                    .map((lesson, index) => (
                      <div key={lesson._id} className="border-b last:border-b-0 p-6 hover:bg-gray-50 transition">
                        <div className="flex items-start gap-4">
                          <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center font-semibold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <h3 className="font-bold text-lg">{lesson.title}</h3>
                              {enrollmentStatus === 'enrolled' && lesson.videoUrl && (
                                <button
                                  onClick={() => {
                                    setSelectedVideo({
                                      url: lesson.videoUrl,
                                      title: lesson.title,
                                    });
                                    setIsVideoPlayerOpen(true);
                                  }}
                                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm flex-shrink-0"
                                  title="Play video"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                  </svg>
                                  <span>Play</span>
                                </button>
                              )}
                              {enrollmentStatus !== 'enrolled' && lesson.videoUrl && (
                                <span className="text-sm text-gray-500 italic flex-shrink-0">Enroll to watch</span>
                              )}
                            </div>
                            {lesson.contentHtml && (
                              <div 
                                className="text-gray-700 text-sm mt-2 prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: lesson.contentHtml.substring(0, 200) + '...' }}
                              />
                            )}
                            {!lesson.videoUrl && (
                              <p className="text-sm text-gray-500 mt-2">No video available for this lesson</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <div className="text-4xl font-bold text-blue-600 mb-6">${course.price}</div>

              {enrollmentStatus === 'enrolled' ? (
                <>
                  <div className="w-full block text-center bg-green-100 border-2 border-green-600 text-green-700 px-6 py-3 rounded-lg font-bold mb-4">
                    ✓ You have enrolled in this course
                  </div>
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    Click "Play" on any lesson to start watching videos
                  </p>
                </>
              ) : (
                <>
                  {!user ? (
                    <>
                      <p className="text-gray-600 mb-4 text-sm">Sign in to purchase this course</p>
                      <Link
                        to="/login"
                        className="w-full block text-center bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition mb-4"
                      >
                        Sign In to Purchase
                      </Link>
                      <Link
                        to="/signup"
                        className="w-full block text-center border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
                      >
                        Create Account
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={handlePurchaseClick}
                      disabled={enrollLoading}
                      className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🛒 Purchase Course
                    </button>
                  )}
                </>
              )}

              <div className="mt-6 pt-6 border-t">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Lessons</p>
                    <p className="font-bold">{course.lessons.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Level</p>
                    <p className="font-bold capitalize">{course.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-bold capitalize">{course.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      <VideoPlayer
        videoUrl={selectedVideo?.url}
        isOpen={isVideoPlayerOpen}
        onClose={() => {
          setIsVideoPlayerOpen(false);
          setSelectedVideo(null);
        }}
        lessonTitle={selectedVideo?.title}
      />

      {/* Payment Modal */}
      {course && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          course={course}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}



