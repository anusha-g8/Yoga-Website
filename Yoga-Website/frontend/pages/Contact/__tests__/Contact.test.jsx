import React from 'react';
import { render, screen } from '@testing-library/react';
import Contact from '../Contact.jsx';

describe('Contact Page', () => {
  it('renders contact page with form fields', () => {
    render(<Contact />);
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Inquiry/i })).toBeInTheDocument();
  });
});
