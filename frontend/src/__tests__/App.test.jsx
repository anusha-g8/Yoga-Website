import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App.jsx';

describe('App', () => {
  it('renders app with layout and initial route', () => {
    render(<App />);
    // Check for navbar presence
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    // Check for Home page content (Hero)
    expect(screen.getByText(/Move with intention/i)).toBeInTheDocument();
  });
});
