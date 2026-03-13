import express from 'express';
import { 
  getSchedule, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule 
} from '../controllers/scheduleController.js';
import { validate } from '../middleware/validate.js';
import { scheduleSchema, idParamSchema } from '../schemas/index.js';

const router = express.Router();

router.get('/', getSchedule);
router.post('/', validate(scheduleSchema), createSchedule);
router.put('/:id', validate(idParamSchema, 'params'), validate(scheduleSchema), updateSchedule);
router.delete('/:id', validate(idParamSchema, 'params'), deleteSchedule);

export default router;
