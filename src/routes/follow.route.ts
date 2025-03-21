import express from 'express';
import FollowController from '../controllers/follow.controller';
import { authCheck } from '../middlewares/auth-check.middleware';

const router = express.Router();

router.get('/followers', authCheck, FollowController.getFollowers);
router.get('/followings', authCheck, FollowController.getFollowings);
router.post('/', authCheck, FollowController.createFollow);
router.delete('/:id', authCheck, FollowController.deleteFollowById);
router.delete(
  '/:followedId',
  authCheck,
  FollowController.deleteFollowByFollowedId,
);

export default router;
