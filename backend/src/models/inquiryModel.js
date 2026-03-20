import { query } from '../db/index.js';

export const createInquiry = async (inquiryData) => {
  // Ensure table exists (as fallback)
  await query(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id SERIAL PRIMARY KEY,
      user_name VARCHAR(100) NOT NULL,
      user_email VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const { user_name, user_email, message } = inquiryData;
  const result = await query(
    'INSERT INTO inquiries (user_name, user_email, message) VALUES ($1, $2, $3) RETURNING *',
    [user_name, user_email, message]
  );
  return result.rows[0];
};

export const getAllInquiries = async () => {
  const result = await query('SELECT * FROM inquiries ORDER BY created_at DESC');
  return result.rows;
};

export const deleteInquiry = async (id) => {
  const result = await query('DELETE FROM inquiries WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
