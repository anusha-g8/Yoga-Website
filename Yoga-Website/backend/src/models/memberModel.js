import { query } from '../db/index.js';

export const getAllMembers = async () => {
  const result = await query('SELECT id, name, email, created_at FROM members ORDER BY created_at DESC');
  return result.rows;
};

export const getMemberByEmail = async (email) => {
  const result = await query('SELECT * FROM members WHERE email = $1', [email]);
  return result.rows[0];
};

export const getMemberById = async (id) => {
  const result = await query('SELECT id, name, email, created_at FROM members WHERE id = $1', [id]);
  return result.rows[0];
};

export const createMember = async (data) => {
  const { name, email, password } = data;
  const result = await query(
    'INSERT INTO members (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
    [name, email, password]
  );
  return result.rows[0];
};

export const deleteMember = async (id) => {
  const result = await query('DELETE FROM members WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
