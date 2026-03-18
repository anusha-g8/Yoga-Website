import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../Home.jsx';

describe('Home Page', () => {
  it('renders home page with all sections', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/Move with intention/i)).toBeInTheDocument();
    expect(screen.getByText(/Featured Practice Sessions/i)).toBeInTheDocument();
    expect(screen.getByText(/What students say/i)).toBeInTheDocument();
    expect(screen.getByText(/Have Questions/i)).toBeInTheDocument();
    expect(screen.getByText(/Join the newsletter/i)).toBeInTheDocument();
  });
});
