import express from 'express';
import threadController from '../controllers/thread.controller';
import { authCheck } from '../middlewares/auth-check.middleware';
import { initCloudinary } from '../middlewares/cloudinary.middleware';
import rateLimit from 'express-rate-limit';
import { uploadImage } from '../middlewares/upload.middleware';

const router = express.Router();

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 menit
  max: 100, // Maksimum 100 request per 5 menit per IP
  standardHeaders: true, // Menggunakan header RateLimit standar (RFC 6585)
  legacyHeaders: false, // Menonaktifkan header RateLimit lama (X-RateLimit-*)
  message: {
    message: 'Too many requests, please try again later.',
  },
});

router.get('/', authCheck, threadController.getThreads);
router.get('/:id', authCheck, threadController.getThreadById);
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
