import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../Home.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('Home page', () => {
  it('renders hero heading', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Move with intention/i })).toBeInTheDocument();
  });
});
