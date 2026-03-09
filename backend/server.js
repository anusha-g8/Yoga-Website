import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { query } from './src/db/index.js';
import programRoutes from './src/routes/programRoutes.js';
import scheduleRoutes from './src/routes/scheduleRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import inquiryRoutes from './src/routes/inquiryRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/programs', programRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    const result = await query('SELECT NOW()');
    res.json({ status: 'OK', dbTime: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'Error', message: 'Database connection failed', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
