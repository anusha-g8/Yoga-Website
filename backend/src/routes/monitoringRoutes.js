import express from 'express';
import { track, getStats } from '../controllers/monitoringController.js';
import { optionalAuth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Public/Optional tracking endpoint
router.post('/track', optionalAuth, track);

// Admin-only stats endpoint
router.get('/stats', adminAuth, getStats);

export default router;
