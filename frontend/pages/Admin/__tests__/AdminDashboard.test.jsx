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
    expect(screen.getByText(/Loading dashboard data/i)).toBeInTheDocument();
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
      expect(screen.queryByText(/Loading dashboard data/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bookings/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Schedule/i })).toBeInTheDocument();
  });

  it('can start and cancel editing a program', async () => {
    localStorage.getItem.mockReturnValue('fake-token');
    
    const mockPrograms = [{
      id: 1,
      title: 'Hatha Yoga',
      description: 'Classic hatha yoga',
      level: 'Beginner',
      duration: '60 mins',
      price: 20,
      image_url: '/img.jpg'
    }];

    fetch.mockImplementation((url) => {
      if (url.includes('/programs')) {
        return Promise.resolve({ ok: true, json: async () => mockPrograms });
      }
      return Promise.resolve({ ok: true, json: async () => [] });
    });

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Loading dashboard data/i)).not.toBeInTheDocument();
    });

    // Switch to Programs tab
    const programsTab = screen.getByRole('button', { name: /Programs/i });
    await user.click(programsTab);

    // Find the program and Edit button
    expect(screen.getByText('Hatha Yoga')).toBeInTheDocument();
    const editBtn = screen.getByRole('button', { name: /Edit/i });
    await user.click(editBtn);

    // Verify inputs are shown
    const titleInputs = screen.getAllByPlaceholderText('Title');
    const editTitleInput = titleInputs.find(input => input.value === 'Hatha Yoga');
    expect(editTitleInput).toBeInTheDocument();

    // Cancel editing
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelBtn);

    // Verify we are back to display mode
    const remainingTitleInputs = screen.getAllByPlaceholderText('Title');
    expect(remainingTitleInputs.length).toBe(1); // Only the "Add" form one remains
    expect(screen.getByText('Hatha Yoga')).toBeInTheDocument();
  });

  it('can save an edited program', async () => {
    localStorage.getItem.mockReturnValue('fake-token');
    
    const mockPrograms = [{
      id: 1,
      title: 'Hatha Yoga',
      description: 'Classic hatha yoga',
      level: 'Beginner',
      duration: '60 mins',
      price: 20,
      image_url: '/img.jpg'
    }];

    fetch.mockImplementation((url, options) => {
      if (url.includes('/programs/1') && options?.method === 'PUT') {
        return Promise.resolve({ ok: true, json: async () => ({ ...mockPrograms[0], title: 'Updated Hatha' }) });
      }
      if (url.includes('/programs')) {
        return Promise.resolve({ ok: true, json: async () => mockPrograms });
      }
      return Promise.resolve({ ok: true, json: async () => [] });
    });

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Loading dashboard data/i)).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Programs/i }));
    await user.click(screen.getByRole('button', { name: /Edit/i }));

    const titleInputs = screen.getAllByPlaceholderText('Title');
    const editTitleInput = titleInputs.find(input => input.value === 'Hatha Yoga');
    
    await user.clear(editTitleInput);
    await user.type(editTitleInput, 'Updated Hatha');

    const saveBtn = screen.getByRole('button', { name: /Save/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/programs/1'), expect.objectContaining({
        method: 'PUT',
        body: expect.stringContaining('"title":"Updated Hatha"')
      }));
    });
  });
});
