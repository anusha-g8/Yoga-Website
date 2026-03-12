import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar.jsx';

describe('Navbar', () => {
  it('renders brand and navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

  // brand is image with alt text
  expect(screen.getByAltText(/Yoga with Anusha/i)).toBeInTheDocument();
  // main nav links
  expect(screen.getByText(/About/i)).toBeInTheDocument();
  expect(screen.getByText(/Courses/i)).toBeInTheDocument();
  });
});
