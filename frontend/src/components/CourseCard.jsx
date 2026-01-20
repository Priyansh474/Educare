import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentAPI } from '../api/client';
import { useAuthStore } from '../store/authStore';

export default function CourseCard({ course, isEnrolled = false, onEnroll }) {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to get placeholder images based on category
  const getPlaceholderImage = (category) => {
    const images = {
      programming: '1522202176988-66273c2fd55f',
      design: '1561070796-0cdf75196e7a',
      business: '1507003211169-0a1dd7228f2d',
      marketing: '1552664730-d307ca884978',
      'data-science': '1551288049-bebda4e38f71',
      other: '1434030216831-4a458c1d5b5c',
    };
    return images[category] || images.other;
  };

  const categoryIcons = {
    programming: '⚙️',
    design: '🎨',
    business: '💼',
    marketing: '📢',
    'data-science': '📊',
    other: '📚',
  };

  const categoryLabels = {
    programming: 'PROGRAMMING',
    design: 'DESIGN',
    business: 'BUSINESS',
    marketing: 'MARKETING',
    'data-science': 'DATA SCIENCE',
    other: 'OTHER',
  };

  const difficultyColors = {
    beginner: 'bg-emerald-600 text-emerald-50',
    intermediate: 'bg-emerald-500 text-emerald-50',
    advanced: 'bg-emerald-800 text-emerald-100',
  };

  // Get instructor name (use course.instructor or default)
  const instructorName = course.instructor || 'Instructor';
  const initials = instructorName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handlePurchase = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to purchase this course');
      return;
    }

    try {
      setIsLoading(true);
      const courseId = course._id || course.id;
      if (!courseId) {
        throw new Error('Course ID not found');
      }
      await enrollmentAPI.enroll(courseId);
      alert('Successfully purchased and enrolled in course!');
      if (onEnroll) {
        onEnroll(courseId);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to purchase course';
      alert(errorMessage);
      console.error('Enrollment error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get image URL or use placeholder
  const imageUrl = course.thumbnailUrl || `https://images.unsplash.com/photo-${getPlaceholderImage(course.category)}?w=800&h=600&fit=crop`;

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="block group relative bg-gradient-to-br from-slate-900/90 via-slate-900 to-slate-950 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
    >
      {/* Course Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop`;
          }}
        />
        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-transparent"></div>
        
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-emerald-400/10 to-emerald-600/20 opacity-50 group-hover:opacity-80 transition-opacity">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/30 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
      </div>

      <div className="relative p-6 flex flex-col h-full z-10">
        {/* Instructor Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {initials}
          </div>
          <div className="text-white">
            <p className="text-xs font-semibold opacity-90 uppercase tracking-wide">
              {instructorName.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Category */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{categoryIcons[course.category] || categoryIcons.other}</span>
          <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">
            {categoryLabels[course.category] || categoryLabels.other}
          </span>
        </div>

        {/* Course Title */}
        <h3 className="text-white font-bold text-xl mb-3 leading-tight flex-1">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-white/70 text-sm mb-6 line-clamp-3 leading-relaxed">
          {course.description}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-3">
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide ${difficultyColors[course.difficulty] || difficultyColors.beginner}`}
          >
            {course.difficulty || 'beginner'}
          </span>

          <span className="text-white border border-white/50 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors pointer-events-none">
            View course
          </span>
        </div>
      </div>
    </Link>
  );
}
