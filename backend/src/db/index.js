import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific file if NODE_ENV is set
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.resolve(process.cwd(), '../', envFile) });
// Also try current directory for Docker environments
dotenv.config(); 

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_HOST.includes('rds.amazonaws.com') ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

export const query = (text, params) => pool.query(text, params);
export default pool;
