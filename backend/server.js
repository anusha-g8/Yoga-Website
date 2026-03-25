import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { initDb, query } from './src/db/index.js';
import programRoutes from './src/routes/programRoutes.js';
import scheduleRoutes from './src/routes/scheduleRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import inquiryRoutes from './src/routes/inquiryRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import videoRoutes from './src/routes/videoRoutes.js';
import memberRoutes from './src/routes/memberRoutes.js';
import newsletterRoutes from './src/routes/newsletterRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import monitoringRoutes from './src/routes/monitoringRoutes.js';
import { auditMiddleware } from './src/middleware/audit.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5002;

// Trust CloudFront proxy for HTTPS headers
app.set('trust proxy', 1);

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Apply audit middleware before routes to capture all activity
app.use(auditMiddleware);

// Enforce HTTPS
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.hostname}${req.url}`);
    }
  }
  next();
});

app.use(cors({
  origin: [
    'https://d3d5zpzj4lgzr9.cloudfront.net',
    'https://d1v8v8v8v8v8v8.cloudfront.net', // Placeholder for prod if different
    'http://localhost:5173',
    'http://localhost:8080'
  ],
  credentials: true
}));
app.use(express.json());

// Custom morgan format for CloudWatch
const morganFormat = '[:date[iso]] :method :url :status :res[content-length] - :response-time ms';
app.use(morgan(morganFormat));

app.use((req, res, next) => {
  console.log(`URL: ${req.url}, NODE_ENV: ${process.env.NODE_ENV}`);
  next();
});

// Routes
app.use('/api/programs', programRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/monitoring', monitoringRoutes);

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    const result = await query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      dbTime: result.rows[0].now,
      env: process.env.NODE_ENV || 'development',
      dbConfig: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER
      }
    });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ 
      status: 'Error', 
      message: 'Database connection failed', 
      error: err.message,
      code: err.code,
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER
      }
    });
  }
});

// Serve frontend static files in production or staging
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));
  
  app.use((req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err);
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: err.message,
    stack: process.env.NODE_ENV === 'dev' ? err.stack : undefined
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    // Initialize database tables
    await initDb();
  });
}

export default app;
