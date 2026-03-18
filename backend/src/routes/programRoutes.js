import express from 'express';
import { getPrograms, createProgram, updateProgram, deleteProgram } from '../controllers/programController.js';
import { validate } from '../middleware/validate.js';
import { adminAuth } from '../middleware/auth.js';
import { programSchema, idParamSchema } from '../schemas/index.js';

const router = express.Router();

router.get('/', getPrograms);
router.post('/', adminAuth, validate(programSchema), createProgram);
router.put('/:id', adminAuth, validate(idParamSchema, 'params'), validate(programSchema), updateProgram);
router.delete('/:id', adminAuth, validate(idParamSchema, 'params'), deleteProgram);

export default router;
