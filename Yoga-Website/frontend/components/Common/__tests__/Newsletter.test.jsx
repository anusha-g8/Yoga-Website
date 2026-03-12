import React from 'react';
import { render, screen } from '@testing-library/react';
import Newsletter from '../Newsletter.jsx';

describe('Newsletter', () => {
  it('renders newsletter heading and form', () => {
    render(<Newsletter />);
    expect(screen.getByText(/Join the newsletter/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your@email.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Subscribe/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });
});
