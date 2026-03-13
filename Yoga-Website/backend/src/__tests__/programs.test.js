import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../server.js';
import * as ProgramModel from '../models/programModel.js';

vi.mock('../models/programModel.js');

describe('Programs API', () => {
  it('GET /api/programs should return all programs', async () => {
    const mockPrograms = [{ id: 1, title: 'Yoga 101' }];
    vi.mocked(ProgramModel.getAllPrograms).mockResolvedValue(mockPrograms);

    const res = await request(app).get('/api/programs');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockPrograms);
  });

  it('POST /api/programs should create a program', async () => {
    const newProgram = { 
      title: 'New Yoga', 
      description: 'Test description', 
      level: 'Beginner', 
      duration: '60 min', 
      price: 20, 
      image_url: '/test.jpg' 
    };
    vi.mocked(ProgramModel.createProgram).mockResolvedValue({ id: 2, ...newProgram });

    const res = await request(app).post('/api/programs').send(newProgram);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New Yoga');
  });

  it('PUT /api/programs/:id should update a program', async () => {
    const updatedProgram = { 
      title: 'Updated Yoga',
      description: 'Updated description',
      level: 'Intermediate',
      duration: '75 min',
      price: 30,
      image_url: '/updated.jpg'
    };
    vi.mocked(ProgramModel.updateProgram).mockResolvedValue({ id: 1, ...updatedProgram });

    const res = await request(app).put('/api/programs/1').send(updatedProgram);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Yoga');
  });

  it('DELETE /api/programs/:id should delete a program', async () => {
    vi.mocked(ProgramModel.deleteProgram).mockResolvedValue({ id: 1 });

    const res = await request(app).delete('/api/programs/1');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Program deleted');
  });
});
