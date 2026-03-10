import { query } from '../db/index.js';

export const getAllPrograms = async () => {
  const result = await query('SELECT * FROM programs ORDER BY created_at DESC');
  return result.rows;
};

export const createProgram = async (data) => {
  const { title, description, level, duration, price, image_url } = data;
  const result = await query(
    'INSERT INTO programs (title, description, level, duration, price, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [title, description, level, duration, price, image_url]
  );
  return result.rows[0];
};

export const updateProgram = async (id, data) => {
  const { title, description, level, duration, price, image_url } = data;
  const result = await query(
    'UPDATE programs SET title = $1, description = $2, level = $3, duration = $4, price = $5, image_url = $6 WHERE id = $7 RETURNING *',
    [title, description, level, duration, price, image_url, id]
  );
  return result.rows[0];
};

export const deleteProgram = async (id) => {
  const result = await query('DELETE FROM programs WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
