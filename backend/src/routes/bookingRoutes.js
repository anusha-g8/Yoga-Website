import express from 'express';
import { postBooking, updateStatus, getBookings, deleteBooking } from '../controllers/bookingController.js';
import { validate } from '../middleware/validate.js';
import { adminAuth, optionalAuth } from '../middleware/auth.js';
import { bookingSchema, idParamSchema } from '../schemas/index.js';

const router = express.Router();

router.get('/', adminAuth, getBookings);
router.post('/', optionalAuth, validate(bookingSchema), postBooking);
router.patch('/:id/status', adminAuth, validate(idParamSchema, 'params'), updateStatus);
router.delete('/:id', adminAuth, validate(idParamSchema, 'params'), deleteBooking);

export default router;
