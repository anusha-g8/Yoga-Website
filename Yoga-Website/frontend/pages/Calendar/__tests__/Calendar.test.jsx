import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Calendar from '../Calendar.jsx';

// Mock fetch
global.fetch = vi.fn();

describe('Calendar Page', () => {
  it('renders loading state initially', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });
    render(<Calendar />);
    expect(screen.getByText(/Loading schedule/i)).toBeInTheDocument();
  });

  it('renders schedule after loading', async () => {
    const mockSchedule = [
      { id: 1, day: 'Monday', time: '08:00 AM', class_name: 'Hatha Yoga', level: 'Beginner' }
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSchedule
    });

    render(<Calendar />);
    await waitFor(() => {
      expect(screen.queryByText(/Loading schedule/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Class Schedule/i)).toBeInTheDocument();
    expect(screen.getByText(/Hatha Yoga/i)).toBeInTheDocument();
    expect(screen.getByText(/Monday/i)).toBeInTheDocument();
  });
});
