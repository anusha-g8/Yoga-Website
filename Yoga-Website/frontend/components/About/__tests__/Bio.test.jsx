import React from 'react';
import { render, screen } from '@testing-library/react';
import Bio from '../Bio.jsx';

describe('Bio', () => {
  it('renders bio heading and text', () => {
    render(<Bio />);
    expect(screen.getByText(/About Anusha/i)).toBeInTheDocument();
    expect(screen.getByText(/certified yoga instructor/i)).toBeInTheDocument();
    expect(screen.getByText(/accessible for beginners/i)).toBeInTheDocument();
  });
});
