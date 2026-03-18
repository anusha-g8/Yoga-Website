import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../server.js';
import * as db from '../db/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock the database query module
vi.mock('../db/index.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    query: vi.fn(),
    initDb: vi.fn(),
  };
});

describe('Members API', () => {
  const JWT_SECRET = process.env.JWT_SECRET || 'member-secret-key-123';
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-token-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/members/register should successfully register a member', async () => {
    const memberData = {
      name: 'Test Member',
      email: 'test@example.com',
      password: 'password123'
    };

    // 1. Mock existing member check (no existing member)
    db.query.mockResolvedValueOnce({ rows: [] });
    // 2. Mock successful insertion
    db.query.mockResolvedValueOnce({ 
      rows: [{ id: 1, name: 'Test Member', email: 'test@example.com', created_at: new Date().toISOString() }] 
    });

    const response = await request(app)
      .post('/api/members/register')
      .send(memberData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.member.email).toBe('test@example.com');
  });

  it('POST /api/members/login should successfully login a member', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const hashedPassword = await bcrypt.hash('password123', 10);
    const mockMember = { id: 1, name: 'Test Member', email: 'test@example.com', password: hashedPassword };

    // 1. Mock finding member by email
    db.query.mockResolvedValueOnce({ rows: [mockMember] });

    const response = await request(app)
      .post('/api/members/login')
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.member.email).toBe('test@example.com');
  });

  it('GET /api/members/profile should return member profile', async () => {
    const mockMember = { id: 1, name: 'Test Member', email: 'test@example.com' };
    const token = jwt.sign({ id: 1 }, JWT_SECRET);

    // 1. Mock finding member by ID
    db.query.mockResolvedValueOnce({ rows: [mockMember] });

    const response = await request(app)
      .get('/api/members/profile')
      .set('x-auth-token', token);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('test@example.com');
  });

  it('GET /api/members/my-bookings should return bookings for the member', async () => {
    const mockBookings = [
      { id: 1, user_name: 'Test Member', class_title: 'Yoga 101' }
    ];
    const token = jwt.sign({ id: 1 }, JWT_SECRET);

    // 1. Mock finding bookings by member ID
    db.query.mockResolvedValueOnce({ rows: mockBookings });

    const response = await request(app)
      .get('/api/members/my-bookings')
      .set('x-auth-token', token);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].class_title).toBe('Yoga 101');
  });

  it('Admin: GET /api/members should return all members', async () => {
    const mockMembers = [{ id: 1, name: 'Member 1' }, { id: 2, name: 'Member 2' }];

    // 1. Mock finding all members
    db.query.mockResolvedValueOnce({ rows: mockMembers });

    const response = await request(app)
      .get('/api/members')
      .set('x-auth-token', ADMIN_TOKEN);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it('Admin: DELETE /api/members/:id should delete a member', async () => {
    // 1. Mock successful deletion
    db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

    const response = await request(app)
      .delete('/api/members/1')
      .set('x-auth-token', ADMIN_TOKEN);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Member deleted');
  });
});
