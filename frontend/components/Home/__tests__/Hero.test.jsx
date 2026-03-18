import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Hero from '../Hero.jsx';

describe('Hero', () => {
  it('renders hero with main heading and call to action', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );
    expect(screen.getByText(/Move with intention/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Start here/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Learn more/i })).toBeInTheDocument();
    expect(screen.getByAltText(/yoga pose/i)).toBeInTheDocument();
  });
});
