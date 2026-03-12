import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment-specific file if NODE_ENV is set
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.resolve(process.cwd(), '../', envFile) });
// Also try current directory for Docker environments
dotenv.config(); 

console.log('DB Config:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  hasPassword: !!process.env.DB_PASSWORD,
  nodeEnv: process.env.NODE_ENV
});

const { Pool } = pg;

const poolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
};

// Handle SSL for RDS or if explicitly requested
if (process.env.DB_HOST && (process.env.DB_HOST.includes('rds.amazonaws.com') || process.env.PGSSLMODE === 'require')) {
  console.log('Enabling SSL for RDS connection...');
  poolConfig.ssl = { 
    rejectUnauthorized: false,
    require: true 
  };
}

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('Successfully connected to the database at:', poolConfig.host);
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client:', {
    message: err.message,
    stack: err.stack,
    code: err.code
  });
});

export const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('Database query error:', {
      message: err.message,
      code: err.code,
      host: poolConfig.host
    });
    throw err;
  }
};

export const initDb = async () => {
  let client;
  try {
    console.log(`Attempting to connect to RDS: ${poolConfig.host}...`);
    client = await pool.connect();
    console.log('Connection established. Ensuring database tables exist...');
    
    const initSqlPath = path.resolve(__dirname, 'init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');
    await client.query(initSql);
    console.log('Database initialization complete.');
  } catch (err) {
    console.error('CRITICAL: Database connection/initialization failed:', {
      message: err.message,
      code: err.code,
      hint: 'Check security group rules (Port 5432) and DB credentials in .env.staging',
      stack: err.stack
    });
  } finally {
    if (client) client.release();
  }
};

export default pool;
