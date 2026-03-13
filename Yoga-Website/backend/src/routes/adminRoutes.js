import express from 'express';
import { login } from '../controllers/adminController.js';
import { validate } from '../middleware/validate.js';
import { adminLoginSchema } from '../schemas/index.js';

const router = express.Router();

router.post('/login', validate(adminLoginSchema), login);

export default router;
