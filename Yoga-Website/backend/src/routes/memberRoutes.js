import express from 'express';
import { register, login, getProfile, getMembers, deleteMember } from '../controllers/memberController.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { memberRegisterSchema, memberLoginSchema } from '../schemas/index.js';

const router = express.Router();

router.post('/register', validate(memberRegisterSchema), register);
router.post('/login', validate(memberLoginSchema), login);
router.get('/profile', auth, getProfile);
router.get('/', getMembers);
router.delete('/:id', deleteMember);

export default router;
