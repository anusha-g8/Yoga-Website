import React from 'react';
import { render, screen } from '@testing-library/react';
import Certifications from '../Certifications.jsx';

describe('Certifications', () => {
  it('renders certifications list', () => {
    render(<Certifications />);
    expect(screen.getByText(/Certifications/i)).toBeInTheDocument();
    expect(screen.getByText(/200hr Yoga Teacher Training/i)).toBeInTheDocument();
    expect(screen.getByText(/Ashtanga and Vinyasa/i)).toBeInTheDocument();
    expect(screen.getByText(/CPR \+ First Aid/i)).toBeInTheDocument();
  });
});
