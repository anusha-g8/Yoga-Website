import { query } from '../db/index.js';

export const createBooking = async (bookingData) => {
  const { user_name, user_email, class_id, program_id, member_id, payment_status, stripe_payment_intent_id } = bookingData;
  const result = await query(
    'INSERT INTO bookings (user_name, user_email, class_id, program_id, member_id, payment_status, stripe_payment_intent_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [user_name, user_email, class_id, program_id, member_id, payment_status || 'unpaid', stripe_payment_intent_id || null]
  );
  return result.rows[0];
};

export const updateBookingStatus = async (id, status) => {
  const result = await query(
    'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
};

export const getAllBookings = async () => {
  const result = await query(`
    SELECT 
      b.*, 
      s.class_name as class_title, 
      p.title as program_title 
    FROM bookings b
    LEFT JOIN schedule s ON b.class_id = s.id
    LEFT JOIN programs p ON b.program_id = p.id
    ORDER BY b.booking_date DESC
  `);
  return result.rows;
};

export const deleteBooking = async (id) => {
  const result = await query('DELETE FROM bookings WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

export const getBookingsByMemberId = async (memberId) => {
  const result = await query(`
    SELECT 
      b.*, 
      s.class_name as class_title, 
      p.title as program_title 
    FROM bookings b
    LEFT JOIN schedule s ON b.class_id = s.id
    LEFT JOIN programs p ON b.program_id = p.id
    WHERE b.member_id = $1
    ORDER BY b.booking_date DESC
  `, [memberId]);
  return result.rows;
};
