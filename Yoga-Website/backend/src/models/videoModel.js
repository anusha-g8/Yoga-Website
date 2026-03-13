import { query } from '../db/index.js';

export const getAllVideos = async () => {
  const result = await query('SELECT * FROM videos ORDER BY created_at DESC');
  return result.rows;
};

export const createVideo = async (data) => {
  const { title, description, level, duration, youtube_id, url } = data;
  const result = await query(
    'INSERT INTO videos (title, description, level, duration, youtube_id, url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [title, description, level, duration, youtube_id, url]
  );
  return result.rows[0];
};

export const updateVideo = async (id, data) => {
  const { title, description, level, duration, youtube_id, url } = data;
  const result = await query(
    'UPDATE videos SET title = $1, description = $2, level = $3, duration = $4, youtube_id = $5, url = $6 WHERE id = $7 RETURNING *',
    [title, description, level, duration, youtube_id, url, id]
  );
  return result.rows[0];
};

export const deleteVideo = async (id) => {
  const result = await query('DELETE FROM videos WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
