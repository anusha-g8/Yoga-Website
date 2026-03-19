import express from 'express';
import { subscribe, getSubscribers, unsubscribe, sendEmailToAll } from '../controllers/newsletterController.js';
import { validate } from '../middleware/validate.js';
import { adminAuth } from '../middleware/auth.js';
import { newsletterSchema, idParamSchema } from '../schemas/index.js';

const router = express.Router();

router.post('/subscribe', validate(newsletterSchema), subscribe);
router.get('/subscribers', adminAuth, getSubscribers);
router.delete('/subscribers/:id', adminAuth, validate(idParamSchema, 'params'), unsubscribe);
router.post('/broadcast', adminAuth, sendEmailToAll);

export default router;
