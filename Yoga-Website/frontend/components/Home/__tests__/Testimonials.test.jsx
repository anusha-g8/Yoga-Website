import React from 'react';
import { render, screen } from '@testing-library/react';
import Testimonials from '../Testimonials.jsx';

describe('Testimonials', () => {
  it('renders testimonials heading and data', () => {
    render(<Testimonials />);
    expect(screen.getByText(/What students say/i)).toBeInTheDocument();
    expect(screen.getByText(/Sabine/i)).toBeInTheDocument();
    expect(screen.getByText(/Varuni Kolli/i)).toBeInTheDocument();
    expect(screen.getByText(/talented, empathetic/i)).toBeInTheDocument();
  });
});
