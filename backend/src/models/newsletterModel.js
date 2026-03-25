import { query } from '../db/index.js';

export const subscribe = async (email) => {
  // Ensure table exists (as fallback)
  console.log('Checking/Creating newsletter table...');
  await query(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100) UNIQUE NOT NULL,
      subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Inserting subscriber:', email);
  const result = await query(
    'INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO UPDATE SET subscribed_at = CURRENT_TIMESTAMP RETURNING *',
    [email]
  );
  console.log('Insert result:', result?.rows ? result.rows[0] : 'No rows returned');
  return result.rows[0];
};

export const getAllSubscribers = async () => {
  const result = await query('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC');
  return result.rows;
};

export const unsubscribe = async (id) => {
  const result = await query('DELETE FROM newsletter_subscribers WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
