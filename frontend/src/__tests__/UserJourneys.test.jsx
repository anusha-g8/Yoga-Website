import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App.jsx';

// Mock fetch for all integration tests
global.fetch = vi.fn();

describe('User Journey & Functional Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // 1. Navigation & Routing (Scenario #3)
  it('User Journey: Navigation from Home to About', async () => {
    render(<App />);
    
    // 1. Start at Home
    expect(screen.getByText(/Move with intention/i)).toBeInTheDocument();

    // 2. Click "Start here" link
    const startLink = screen.getByRole('link', { name: /Start here/i });
    fireEvent.click(startLink);

    // 3. Should now be on About page
    expect(screen.getByRole('heading', { name: /About Anusha/i })).toBeInTheDocument();
    expect(screen.queryByText(/Move with intention/i)).not.toBeInTheDocument();
  });

  // 2. Authentication Guard (Scenario #4)
  it('Security: Redirects unauthorized users from Admin Dashboard', async () => {
    // Manually push the path to /admin/dashboard
    window.history.pushState({}, 'Test', '/admin/dashboard');
    
    render(<App />);

    // Should detect no token and eventually show Login page
    await waitFor(() => {
      expect(screen.getByText(/Admin Login/i)).toBeInTheDocument();
    });
  });

  // 3. Content Resilience - Empty States (Scenario #5)
  it('Resilience: Shows friendly message when no classes are scheduled', async () => {
    // Mock empty response from backend
    fetch.mockResolvedValue({
      ok: true,
      json: async () => []
    });

    window.history.pushState({}, 'Test', '/calendar');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/No classes scheduled for this week/i)).toBeInTheDocument();
    });
  });

  it('Resilience: Shows friendly message when no courses are available', async () => {
    // Mock empty response
    fetch.mockResolvedValue({
      ok: true,
      json: async () => []
    });

    window.history.pushState({}, 'Test', '/courses');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/No courses currently available/i)).toBeInTheDocument();
    });
  });

  // 4. Contact-to-Submission Loop (Scenario #1 partial - UI side)
  it('Functional: Contact form submission shows success and clears', async () => {
    fetch.mockResolvedValue({ 
      ok: true,
      json: async () => ({ success: true })
    }); // Mock success response

    window.history.pushState({}, 'Test', '/contact');
    render(<App />);

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const messageInput = screen.getByLabelText(/Message/i);
    const submitBtn = screen.getByRole('button', { name: /Send Inquiry/i });

    fireEvent.change(nameInput, { target: { value: 'Test User', name: 'user_name' } });
    fireEvent.change(emailInput, { target: { value: 'test@user.com', name: 'user_email' } });
    fireEvent.change(messageInput, { target: { value: 'Hello yoga!', name: 'message' } });
    
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Inquiry sent successfully/i)).toBeInTheDocument();
    });

    // Inputs should be cleared
    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(messageInput.value).toBe('');
  });
});
