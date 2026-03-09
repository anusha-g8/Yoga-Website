import { query } from '../db/index.js';

export const getAllPrograms = async () => {
  const result = await query('SELECT * FROM programs ORDER BY created_at DESC');
  return result.rows;
};

export const getProgramById = async (id) => {
  const result = await query('SELECT * FROM programs WHERE id = $1', [id]);
  return result.rows[0];
};
