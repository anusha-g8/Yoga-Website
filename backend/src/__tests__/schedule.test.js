import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../server.js';
import * as ScheduleModel from '../models/scheduleModel.js';

vi.mock('../models/scheduleModel.js');

describe('Schedule API', () => {
  it('GET /api/schedule should return all schedule items', async () => {
    const mockSchedule = [{ id: 1, class_name: 'Morning Flow' }];
    vi.mocked(ScheduleModel.getAllSchedule).mockResolvedValue(mockSchedule);

    const res = await request(app).get('/api/schedule');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockSchedule);
  });

  it('POST /api/schedule should create a schedule item', async () => {
    const newItem = { 
      day: 'Monday', 
      time: '08:00 - 09:00', 
      class_name: 'Evening Flow', 
      level: 'All levels' 
    };
    vi.mocked(ScheduleModel.createSchedule).mockResolvedValue({ id: 2, ...newItem });

    const res = await request(app)
      .post('/api/schedule')
      .set('x-auth-token', 'admin-token-123')
      .send(newItem);
    expect(res.status).toBe(201);
    expect(res.body.class_name).toBe('Evening Flow');
  });

  it('DELETE /api/schedule/:id should delete a schedule item', async () => {
    vi.mocked(ScheduleModel.deleteSchedule).mockResolvedValue({ id: 1 });

    const res = await request(app)
      .delete('/api/schedule/1')
      .set('x-auth-token', 'admin-token-123');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Schedule item deleted');
  });
});
