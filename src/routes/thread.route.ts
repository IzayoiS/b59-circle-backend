import express from 'express';
import threadController from '../controllers/thread.controller';
import { authCheck } from '../middlewares/auth-check.middleware';
import { initCloudinary } from '../middlewares/cloudinary.middleware';
import rateLimit from 'express-rate-limit';
import { uploadImage } from '../middlewares/upload.middleware';

const router = express.Router();

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests, please try again later.',
  },
});

router.get('/', authCheck, threadController.getThreads);
router.get('/:id', authCheck, threadController.getThreadById);
router.patch('/:id', authCheck, threadController.updateThread);
router.delete('/:id', authCheck, threadController.deleteThread);
router.get('/user/:userId', authCheck, threadController.getUserThreads);
router.post(
  '/',
  limiter,
  authCheck,
  initCloudinary,
  uploadImage.single('images'),
  threadController.createThread,
);

export default router;
