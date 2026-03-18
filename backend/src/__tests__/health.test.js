import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../server.js';
import * as db from '../db/index.js';

// Mock the database query module
vi.mock('../db/index.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    query: vi.fn(),
    initDb: vi.fn(),
  };
});

describe('Health API', () => {
  it('GET /api/health should return 200 and status OK when DB is connected', async () => {
    // Mock successful DB response
    db.query.mockResolvedValueOnce({ rows: [{ now: new Date().toISOString() }] });

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body).toHaveProperty('dbTime');
  });

  it('GET /api/health should return 500 when DB query fails', async () => {
    // Mock DB failure
    db.query.mockRejectedValueOnce(new Error('DB Error'));

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(500);
    expect(response.body.status).toBe('Error');
    expect(response.body.message).toBe('Database connection failed');
  });
});
