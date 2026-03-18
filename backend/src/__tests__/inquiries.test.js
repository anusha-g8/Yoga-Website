import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../server.js';
import * as InquiryModel from '../models/inquiryModel.js';

vi.mock('../models/inquiryModel.js');

describe('Inquiries API', () => {
  it('GET /api/inquiries should return all inquiries', async () => {
    const mockInquiries = [{ id: 1, message: 'Hello' }];
    vi.mocked(InquiryModel.getAllInquiries).mockResolvedValue(mockInquiries);

    const res = await request(app).get('/api/inquiries');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockInquiries);
  });

  it('POST /api/inquiries should create an inquiry', async () => {
    const newInquiry = { user_name: 'John', user_email: 'john@example.com', message: 'Test message' };
    vi.mocked(InquiryModel.createInquiry).mockResolvedValue({ id: 2, ...newInquiry });

    const res = await request(app).post('/api/inquiries').send(newInquiry);
    expect(res.status).toBe(201);
    expect(res.body.user_name).toBe('John');
  });

  it('DELETE /api/inquiries/:id should delete an inquiry', async () => {
    vi.mocked(InquiryModel.deleteInquiry).mockResolvedValue({ id: 1 });

    const res = await request(app).delete('/api/inquiries/1');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Inquiry deleted');
  });
});
