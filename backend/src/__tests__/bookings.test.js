import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../server.js';
import * as BookingModel from '../models/bookingModel.js';
import * as MemberModel from '../models/memberModel.js';

vi.mock('../models/bookingModel.js');
vi.mock('../models/memberModel.js');

describe('Bookings API', () => {
  it('GET /api/bookings should return all bookings', async () => {
    const mockBookings = [{ id: 1, user_name: 'John Doe' }];
    vi.mocked(BookingModel.getAllBookings).mockResolvedValue(mockBookings);

    const res = await request(app)
      .get('/api/bookings')
      .set('x-auth-token', 'admin-token-123');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockBookings);
  });

  it('POST /api/bookings should create a booking', async () => {
    const newBooking = { user_name: 'Jane Doe', user_email: 'jane@example.com', class_id: 1 };
    vi.mocked(MemberModel.getMemberByEmail).mockResolvedValue(null);
    vi.mocked(BookingModel.createBooking).mockResolvedValue({ id: 2, ...newBooking, status: 'pending' });

    const res = await request(app).post('/api/bookings').send(newBooking);
    expect(res.status).toBe(201);
    expect(res.body.user_name).toBe('Jane Doe');
  });

  it('POST /api/bookings should return 400 if fields missing', async () => {
    const res = await request(app).post('/api/bookings').send({ user_name: 'Jane' });
    expect(res.status).toBe(400);
  });

  it('PATCH /api/bookings/:id/status should update status', async () => {
    vi.mocked(BookingModel.updateBookingStatus).mockResolvedValue({ id: 1, status: 'confirmed' });

    const res = await request(app)
      .patch('/api/bookings/1/status')
      .set('x-auth-token', 'admin-token-123')
      .send({ status: 'confirmed' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('confirmed');
  });
});
