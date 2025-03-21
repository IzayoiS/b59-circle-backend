import express from 'express';
import profileController from '../controllers/profile.controller';

const router = express.Router();

router.get('/:id', profileController.getUserProfileById);
router.patch('/:id', profileController.updateUserProfile);

export default router;
