import { query } from '../db/index.js';

export const createInquiry = async (inquiryData) => {
  const { user_name, user_email, message } = inquiryData;
  const result = await query(
    'INSERT INTO inquiries (user_name, user_email, message) VALUES ($1, $2, $3) RETURNING *',
    [user_name, user_email, message]
  );
  return result.rows[0];
};
