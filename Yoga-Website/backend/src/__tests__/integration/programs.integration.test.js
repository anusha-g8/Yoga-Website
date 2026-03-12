import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../server.js';
import * as db from '../../db/index.js';

// Mock only the query function in the db module
vi.mock('../../db/index.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    query: vi.fn(),
    initDb: vi.fn(),
  };
});

describe('Programs Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a program and then retrieve it (integrated flow)', async () => {
    const newProgramData = {
      title: 'Advanced Vinyasa',
      description: 'A challenging flow',
      level: 'Advanced',
      duration: '60 min',
      price: 25,
      image_url: '/img.jpg'
    };

    const mockCreatedProgram = { id: 10, ...newProgramData, created_at: new Date().toISOString() };

    // 1. Mock the INSERT response
    db.query.mockResolvedValueOnce({ rows: [mockCreatedProgram] });

    // 2. Perform POST request
    const postRes = await request(app)
      .post('/api/programs')
      .send(newProgramData);

    expect(postRes.status).toBe(201);
    expect(postRes.body.title).toBe('Advanced Vinyasa');
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO programs'),
      expect.arrayContaining(['Advanced Vinyasa'])
    );

    // 3. Mock the SELECT response for the next step
    db.query.mockResolvedValueOnce({ rows: [mockCreatedProgram] });

    // 4. Perform GET request to verify retrieval
    const getRes = await request(app).get('/api/programs');

    expect(getRes.status).toBe(200);
    expect(getRes.body).toBeInstanceOf(Array);
    expect(getRes.body[0].title).toBe('Advanced Vinyasa');
  });

  it('should handle 404 when updating non-existent program', async () => {
    db.query.mockResolvedValueOnce({ rows: [] }); // No rows updated

    const res = await request(app)
      .put('/api/programs/999')
      .send({ title: 'Non-existent' });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Program not found');
  });
});
