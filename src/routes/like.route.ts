import express from 'express';
import likeController from '../controllers/like.controller';
import { authCheck } from '../middlewares/auth-check.middleware';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: {
    message: 'Too many requests, please try again later.',
  },
  // store: ... , // Redis, Memcached, etc. See below.
});

router.use(limiter);

router.post('/', authCheck, likeController.createLike);
router.delete('/:threadId', authCheck, likeController.deleteLike);

export default router;
