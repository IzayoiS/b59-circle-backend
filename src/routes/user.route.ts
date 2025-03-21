import express from 'express';
import userController from '../controllers/user.controller';

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.get('/suggested/:id', userController.getSuggestedUsers);
router.get('/username/:username', userController.getUserByUsername);
router.post('/', userController.createUser);
router.patch('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUserById);

export default router;
