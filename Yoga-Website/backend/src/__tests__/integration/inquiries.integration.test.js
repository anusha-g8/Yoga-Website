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

describe('Inquiries Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should submit an inquiry and then retrieve it', async () => {
    const inquiryData = {
      user_name: 'Jane Doe',
      user_email: 'jane@yoga.com',
      message: 'I would like to join the morning flow.'
    };

    const mockInquiry = { 
      id: 100, 
      ...inquiryData, 
      created_at: new Date().toISOString() 
    };

    // 1. Mock the INSERT
    db.query.mockResolvedValueOnce({ rows: [mockInquiry] });

    const postRes = await request(app)
      .post('/api/inquiries')
      .send(inquiryData);

    expect(postRes.status).toBe(201);
    expect(postRes.body.user_name).toBe('Jane Doe');

    // 2. Mock the SELECT ALL
    db.query.mockResolvedValueOnce({ rows: [mockInquiry] });

    const getRes = await request(app).get('/api/inquiries');

    expect(getRes.status).toBe(200);
    expect(getRes.body[0].message).toContain('morning flow');
  });

  it('should return 400 when inquiry message is missing', async () => {
    const res = await request(app)
      .post('/api/inquiries')
      .send({ user_name: 'No Message', user_email: 'test@test.com' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Missing required inquiry fields');
  });

  it('should delete an inquiry', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 100 }] });

    const res = await request(app).delete('/api/inquiries/100');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Inquiry deleted');
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM inquiries'),
      ['100']
    );
  });
});
