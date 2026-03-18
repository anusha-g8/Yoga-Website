import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../server.js';
import * as db from '../db/index.js';

// Mock the database query module
vi.mock('../db/index.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    query: vi.fn(),
    initDb: vi.fn(),
  };
});

describe('Videos API', () => {
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-token-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/videos should return all videos', async () => {
    const mockVideos = [{ id: 1, title: 'Yoga Video 1', youtube_id: 'abc' }];
    db.query.mockResolvedValueOnce({ rows: mockVideos });

    const response = await request(app).get('/api/videos');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe('Yoga Video 1');
  });

  it('POST /api/videos should create a video', async () => {
    const videoData = {
      title: 'New Yoga Video',
      level: 'Beginner',
      duration: '10 min',
      youtube_id: 'xyz123'
    };
    const mockCreated = { id: 2, ...videoData };
    db.query.mockResolvedValueOnce({ rows: [mockCreated] });

    const response = await request(app)
      .post('/api/videos')
      .set('x-auth-token', ADMIN_TOKEN)
      .send(videoData);

    expect(response.status).toBe(201);
    expect(response.body.youtube_id).toBe('xyz123');
  });

  it('PUT /api/videos/:id should update a video', async () => {
    const videoData = {
      title: 'Updated Yoga Video',
      level: 'Intermediate',
      duration: '20 min',
      youtube_id: 'xyz123'
    };
    const mockUpdated = { id: 2, ...videoData };
    db.query.mockResolvedValueOnce({ rows: [mockUpdated] });

    const response = await request(app)
      .put('/api/videos/2')
      .set('x-auth-token', ADMIN_TOKEN)
      .send(videoData);

    expect(response.status).toBe(200);
    expect(response.body.level).toBe('Intermediate');
  });

  it('DELETE /api/videos/:id should delete a video', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 2 }] });

    const response = await request(app)
      .delete('/api/videos/2')
      .set('x-auth-token', ADMIN_TOKEN);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Video deleted');
  });
});
