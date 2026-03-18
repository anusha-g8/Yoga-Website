import express from 'express';
import { getPrograms, createProgram, updateProgram, deleteProgram } from '../controllers/programController.js';
import { validate } from '../middleware/validate.js';
import { programSchema, idParamSchema } from '../schemas/index.js';

const router = express.Router();

router.get('/', getPrograms);
router.post('/', validate(programSchema), createProgram);
router.put('/:id', validate(idParamSchema, 'params'), validate(programSchema), updateProgram);
router.delete('/:id', validate(idParamSchema, 'params'), deleteProgram);

export default router;
