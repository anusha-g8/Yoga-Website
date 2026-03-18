import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminLogin from '../AdminLogin.jsx';

describe('AdminLogin Page', () => {
  it('renders login form', () => {
    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    );
    expect(screen.getByText(/Admin Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });
});
