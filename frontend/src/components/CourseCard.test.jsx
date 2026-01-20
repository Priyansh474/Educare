import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CourseCard from '../src/components/CourseCard';

describe('CourseCard Component', () => {
  const mockCourse = {
    _id: '1',
    title: 'Test Course',
    slug: 'test-course',
    description: 'This is a test course description',
    price: 29.99,
    difficulty: 'beginner',
    category: 'programming',
    instructor: 'Test Instructor',
    lessons: [],
  };

  it('renders course card with all information', () => {
    render(<CourseCard course={mockCourse} />);
    
    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('This is a test course description')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('beginner')).toBeInTheDocument();
  });

  it('displays the View button', () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  it('has correct difficulty styling', () => {
    render(<CourseCard course={mockCourse} />);
    const difficultyBadge = screen.getByText('beginner');
    expect(difficultyBadge).toHaveClass('bg-green-100', 'text-green-800');
  });
});
