import React from 'react';
import { render, screen } from '@testing-library/react';
import Bio from '../Bio.jsx';

describe('Bio', () => {
  it('renders bio heading and text', () => {
    render(<Bio />);
    // Target the heading specifically
    expect(screen.getByRole('heading', { name: /Anusha Ghali/i })).toBeInTheDocument();
    expect(screen.getByAltText(/Anusha Ghali/i)).toBeInTheDocument();
    expect(screen.getByText(/dedicated yoga instructor/i)).toBeInTheDocument();
    expect(screen.getByText(/Ashtanga, Vinyasa, Hatha, and Yin Yoga/i)).toBeInTheDocument();
  });
});
