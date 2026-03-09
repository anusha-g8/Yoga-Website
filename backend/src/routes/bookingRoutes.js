import express from 'express';
import { postBooking, updateStatus, getBookings } from '../controllers/bookingController.js';

const router = express.Router();

router.get('/', getBookings);
router.post('/', postBooking);
router.patch('/:id/status', updateStatus);

export default router;
