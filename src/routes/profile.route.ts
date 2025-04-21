import express from 'express';
import profileController from '../controllers/profile.controller';
import {
  uploadImage,
  uploadToCloudinary,
} from '../middlewares/upload.middleware';
import { initCloudinary } from '../middlewares/cloudinary.middleware';
import { authCheck } from '../middlewares/auth-check.middleware';

const router = express.Router();

router.get('/:id', profileController.getUserProfileById);
router.patch(
  '/:id',
  authCheck,
  initCloudinary,
  uploadImage.single('avatar'),
  uploadToCloudinary,
  profileController.updateUserProfile,
);

export default router;
