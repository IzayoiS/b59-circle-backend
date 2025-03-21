import express from 'express';
import replyController from '../controllers/reply.controller';
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

router.get('/:threadId', authCheck, replyController.getRepliesByThreadId);
router.post(
  '/:threadId',
  limiter,
  authCheck,
  initCloudinary,
  uploadImage.single('images'),
  replyController.createReply,
);

export default router;
