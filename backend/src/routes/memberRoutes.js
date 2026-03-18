import express from 'express';
import { register, login, getProfile, getMyBookings, getMembers, deleteMember } from '../controllers/memberController.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { memberRegisterSchema, memberLoginSchema, idParamSchema } from '../schemas/index.js';

const router = express.Router();

router.post('/register', validate(memberRegisterSchema), register);
router.post('/login', validate(memberLoginSchema), login);
router.get('/profile', auth, getProfile);
router.get('/my-bookings', auth, getMyBookings);
router.get('/', adminAuth, getMembers);
router.delete('/:id', adminAuth, validate(idParamSchema, 'params'), deleteMember);

export default router;
