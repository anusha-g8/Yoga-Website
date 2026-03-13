import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server.js';

describe('Admin API', () => {
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin';

  it('POST /api/admin/login should return 200 and token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: adminUser, password: adminPass });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /api/admin/login should return 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: 'wrong', password: 'wrong' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
