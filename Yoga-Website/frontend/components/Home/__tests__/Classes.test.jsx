import React from 'react';
import { render, screen } from '@testing-library/react';
import Classes from '../Classes.jsx';

describe('Classes', () => {
  it('renders classes heading and sessions', () => {
    render(<Classes />);
    expect(screen.getByText(/Featured Practice Sessions/i)).toBeInTheDocument();
    expect(screen.getByText(/Easy Morning Yoga/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Body Flow/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Body Detox/i)).toBeInTheDocument();
    expect(screen.getAllByTitle(/Easy Morning Yoga|Full Body Flow|Total Body Detox/i)).toHaveLength(3);
    expect(screen.getAllByRole('link', { name: /Watch on YouTube/i })).toHaveLength(3);
  });
});
