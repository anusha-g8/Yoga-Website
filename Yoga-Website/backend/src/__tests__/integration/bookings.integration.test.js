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

describe('Bookings Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a booking and update its status', async () => {
    const bookingData = {
      user_name: 'Integration User',
      user_email: 'integration@test.com',
      class_id: 1
    };

    const mockBooking = { 
      id: 50, 
      ...bookingData, 
      status: 'pending',
      booking_date: new Date().toISOString()
    };

    // 1. Mock the INSERT for creation
    db.query.mockResolvedValueOnce({ rows: [mockBooking] });

    const postRes = await request(app)
      .post('/api/bookings')
      .send(bookingData);

    expect(postRes.status).toBe(201);
    expect(postRes.body.status).toBe('pending');

    // 2. Mock the UPDATE for status change
    const updatedBooking = { ...mockBooking, status: 'confirmed' };
    db.query.mockResolvedValueOnce({ rows: [updatedBooking] });

    const patchRes = await request(app)
      .patch('/api/bookings/50/status')
      .send({ status: 'confirmed' });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.status).toBe('confirmed');
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE bookings SET status'),
      expect.arrayContaining(['confirmed', '50'])
    );
  });

  it('should return 400 when missing required booking fields', async () => {
    const incompleteData = { user_name: 'Missing Email' };

    const res = await request(app)
      .post('/api/bookings')
      .send(incompleteData);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(db.query).not.toHaveBeenCalled();
  });

  it('should return 404 when updating status of non-existent booking', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .patch('/api/bookings/999/status')
      .send({ status: 'confirmed' });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Booking not found');
  });

  it('should delete a booking record', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 50 }] });

    const res = await request(app).delete('/api/bookings/50');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Booking deleted');
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM bookings'),
      ['50']
    );
  });
});
