import express from 'express';
import { getVideos, createVideo, updateVideo, deleteVideo } from '../controllers/videoController.js';
import { validate } from '../middleware/validate.js';
import { videoSchema, idParamSchema } from '../schemas/index.js';

const router = express.Router();

router.get('/', getVideos);
router.post('/', validate(videoSchema), createVideo);
router.put('/:id', validate(idParamSchema, 'params'), validate(videoSchema), updateVideo);
router.delete('/:id', validate(idParamSchema, 'params'), deleteVideo);

export default router;
