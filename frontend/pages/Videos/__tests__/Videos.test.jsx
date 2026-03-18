import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Videos from '../Videos.jsx';

describe('Videos Page', () => {
  const mockVideos = [
    {
      title: 'Easy Morning Yoga For Beginners',
      description: 'A gentle 15-minute morning flow.',
      youtube_id: 'sample1',
      duration: '15 min',
      level: 'Beginner'
    },
    {
      title: 'Full Body Flow - Breathe & Release',
      description: 'Release tension with this 30-minute full body practice.',
      youtube_id: 'sample2',
      duration: '30 min',
      level: 'Intermediate'
    }
  ];

  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockVideos),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders videos page with heading and sample videos', async () => {
    render(
      <MemoryRouter>
        <Videos />
      </MemoryRouter>
    );

    // Wait for loading to finish and heading to appear
    expect(await screen.findByText('Sample Practice Videos')).toBeInTheDocument();
    
    // Check for video titles
    expect(screen.getByText(/Easy Morning Yoga For Beginners/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Body Flow - Breathe & Release/i)).toBeInTheDocument();
    
    // Check for portal access button
    expect(screen.getByText(/Access Member Portal/i)).toBeInTheDocument();
  });
});
