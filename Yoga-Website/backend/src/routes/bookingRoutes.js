import express from 'express';
import { postBooking, updateStatus, getBookings, deleteBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.get('/', getBookings);
router.post('/', postBooking);
router.patch('/:id/status', updateStatus);
router.delete('/:id', deleteBooking);

export default router;
