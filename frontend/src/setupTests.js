import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Default fetch mock
global.fetch = vi.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
    headers: new Headers({ 'content-type': 'application/json' })
  })
);
