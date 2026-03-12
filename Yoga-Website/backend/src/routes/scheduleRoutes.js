import express from 'express';
import { 
  getSchedule, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule 
} from '../controllers/scheduleController.js';

const router = express.Router();

router.get('/', getSchedule);
router.post('/', createSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

export default router;
