import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer.jsx';

describe('Footer', () => {
  it('renders footer with brand and copyright', () => {
    render(<Footer />);
    expect(screen.getByText(/Yoga with Anusha/i)).toBeInTheDocument();
    expect(screen.getByText(/Mindful movement for every body/i)).toBeInTheDocument();
    expect(screen.getByText(/© \d{4} Anusha Ghali/i)).toBeInTheDocument();
  });
});
