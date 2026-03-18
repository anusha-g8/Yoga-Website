import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Courses from '../Courses.jsx';

// Mock fetch
global.fetch = vi.fn();

describe('Courses Page', () => {
  it('renders loading state initially', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });
    render(<Courses />);
    expect(screen.getByText(/Loading courses/i)).toBeInTheDocument();
  });

  it('renders courses after loading', async () => {
    const mockCourses = [
      { id: 1, title: 'Yoga for Stress', description: 'Relaxing yoga', image_url: 'test.jpg', duration: '4 weeks', price: 99 }
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourses
    });

    render(<Courses />);
    await waitFor(() => {
      expect(screen.queryByText(/Loading courses/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Online Courses & Packages/i)).toBeInTheDocument();
    expect(screen.getByText(/Yoga for Stress/i)).toBeInTheDocument();
    expect(screen.getByText(/\$99/i)).toBeInTheDocument();
  });
});
