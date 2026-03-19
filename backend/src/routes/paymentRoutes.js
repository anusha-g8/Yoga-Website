import express from 'express';
import { createPaymentIntent, handleWebhook } from '../controllers/paymentController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public route to create a payment intent (used when user clicks "Enroll")
// optionalAuth is used to link to member account if logged in
router.post('/create-intent', optionalAuth, createPaymentIntent);

// Webhook route (must be handled with express.raw() in server.js)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
