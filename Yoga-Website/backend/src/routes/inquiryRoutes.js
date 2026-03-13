import express from 'express';
import { postInquiry, getInquiries, deleteInquiry } from '../controllers/inquiryController.js';
import { validate } from '../middleware/validate.js';
import { inquirySchema, idParamSchema } from '../schemas/index.js';

const router = express.Router();

router.post('/', validate(inquirySchema), postInquiry);
router.get('/', getInquiries);
router.delete('/:id', validate(idParamSchema, 'params'), deleteInquiry);

export default router;
