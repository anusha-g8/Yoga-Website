import express from 'express';
import { postInquiry, getInquiries, deleteInquiry } from '../controllers/inquiryController.js';
import { validate } from '../middleware/validate.js';
import { adminAuth } from '../middleware/auth.js';
import { inquirySchema, idParamSchema } from '../schemas/index.js';

const router = express.Router();

router.post('/', validate(inquirySchema), postInquiry);
router.get('/', adminAuth, getInquiries);
router.delete('/:id', adminAuth, validate(idParamSchema, 'params'), deleteInquiry);

export default router;
