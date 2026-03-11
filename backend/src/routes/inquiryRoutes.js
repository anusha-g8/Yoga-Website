import express from 'express';
import { postInquiry, getInquiries, deleteInquiry } from '../controllers/inquiryController.js';

const router = express.Router();

router.post('/', postInquiry);
router.get('/', getInquiries);
router.delete('/:id', deleteInquiry);

export default router;
