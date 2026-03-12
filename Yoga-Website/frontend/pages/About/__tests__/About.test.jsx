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
    expect(screen.getByText(/Learn more about Anusha/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /About Anusha/i })).toBeInTheDocument();
    expect(screen.getByText(/Certifications/i)).toBeInTheDocument();
  });
});
