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

describe('Admin Integrated Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Admin: should add a new program and verify it exists in the list', async () => {
    const adminProgram = {
      title: 'Admin Special Workshop',
      description: 'Exclusive session',
      level: 'All levels',
      duration: '2 hours',
      price: 50,
      image_url: '/workshop.jpg'
    };

    const mockSavedProgram = { id: 200, ...adminProgram, created_at: new Date().toISOString() };

    // 1. Mock the INSERT
    db.query.mockResolvedValueOnce({ rows: [mockSavedProgram] });

    const postRes = await request(app)
      .post('/api/programs')
      .send(adminProgram);

    expect(postRes.status).toBe(201);
    expect(postRes.body.id).toBe(200);

    // 2. Mock the GET ALL to include the new program
    db.query.mockResolvedValueOnce({ rows: [mockSavedProgram] });

    const getRes = await request(app).get('/api/programs');
    expect(getRes.status).toBe(200);
    expect(getRes.body.find(p => p.title === 'Admin Special Workshop')).toBeDefined();
  });

  it('Admin: should add a new class to the schedule', async () => {
    const newClass = {
      day: 'Saturday',
      time: '10:00 - 11:30',
      class_name: 'Weekend Warrior',
      level: 'Intermediate'
    };

    const mockSavedClass = { id: 300, ...newClass };

    // 1. Mock INSERT for schedule
    db.query.mockResolvedValueOnce({ rows: [mockSavedClass] });

    const postRes = await request(app)
      .post('/api/schedule')
      .send(newClass);

    expect(postRes.status).toBe(201);
    expect(postRes.body.class_name).toBe('Weekend Warrior');

    // 2. Verify deletion of that class
    db.query.mockResolvedValueOnce({ rows: [mockSavedClass] });
    const deleteRes = await request(app).delete('/api/schedule/300');
    
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toBe('Schedule item deleted');
  });
});
