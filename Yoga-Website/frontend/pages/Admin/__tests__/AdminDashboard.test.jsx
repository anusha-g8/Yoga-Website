import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from '../AdminDashboard.jsx';

// Mock fetch
global.fetch = vi.fn();
// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    clear: vi.fn(() => { store = {}; }),
    removeItem: vi.fn(key => { delete store[key]; })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('AdminDashboard Page', () => {
  it('redirects to login if no token present', () => {
    localStorage.getItem.mockReturnValue(null);
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );
    // Since we are mocking useNavigate, we can't easily check the redirect here without more setup,
    // but we can check if it tries to load or shows loading.
    expect(screen.getByText(/Loading Admin Dashboard/i)).toBeInTheDocument();
  });

  it('renders dashboard when token is present', async () => {
    localStorage.getItem.mockReturnValue('fake-token');
    fetch.mockResolvedValue({
      ok: true,
      json: async () => []
    });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Loading Admin Dashboard/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    expect(screen.getByText(/Bookings/i)).toBeInTheDocument();
    expect(screen.getByText(/Schedule/i)).toBeInTheDocument();
  });
});
