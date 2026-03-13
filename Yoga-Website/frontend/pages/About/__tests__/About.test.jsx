import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import About from '../About.jsx';

describe('About Page', () => {
  it('renders about page with header and subcomponents', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    expect(screen.getByText(/About Anusha's Yoga/i)).toBeInTheDocument();
    expect(screen.getByText(/Class Philosophy/i)).toBeInTheDocument();
    expect(screen.getByText(/balanced blend of Ashtanga discipline/i)).toBeInTheDocument();
    // Use getAllByText for multiple occurrences or getByRole for heading
    expect(screen.getByRole('heading', { name: /Anusha Ghali/i })).toBeInTheDocument();
    expect(screen.getByText(/Certifications & Expertise/i)).toBeInTheDocument();
  });
});
