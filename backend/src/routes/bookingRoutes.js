import express from 'express';
import { postBooking, updateStatus, getBookings, deleteBooking } from '../controllers/bookingController.js';
import { validate } from '../middleware/validate.js';
import { bookingSchema, idParamSchema } from '../schemas/index.js';

const router = express.Router();

router.get('/', getBookings);
router.post('/', validate(bookingSchema), postBooking);
router.patch('/:id/status', validate(idParamSchema, 'params'), updateStatus);
router.delete('/:id', validate(idParamSchema, 'params'), deleteBooking);

export default router;
