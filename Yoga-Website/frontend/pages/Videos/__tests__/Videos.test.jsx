import React from 'react';
import { render, screen } from '@testing-library/react';
import Videos from '../Videos.jsx';

describe('Videos Page', () => {
  it('renders videos page with heading and sample videos', () => {
    render(<Videos />);
    expect(screen.getByText(/Sample Practice Videos/i)).toBeInTheDocument();
    expect(screen.getByText(/Easy Morning Yoga For Beginners/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Body Flow - Breathe & Release/i)).toBeInTheDocument();
    expect(screen.getAllByTitle(/Easy Morning Yoga For Beginners|Full Body Flow - Breathe & Release/i)).toHaveLength(2);
    expect(screen.getByText(/Access Member Portal/i)).toBeInTheDocument();
  });
});
