import React from 'react';
import { render, screen } from '@testing-library/react';
import InquirySection from '../InquirySection.jsx';

describe('InquirySection', () => {
  it('renders inquiry section with form fields', () => {
    render(<InquirySection />);
    expect(screen.getByText(/Have Questions/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Inquiry/i })).toBeInTheDocument();
  });
});
