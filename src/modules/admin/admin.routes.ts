import express from 'express';
import adminController from './admin.controller';
import validate from '../../middlewares/validate.middleware';
import { register, login, updateProfile } from './admin.validation';
import { protect, restrictTo } from '../../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', validate(register), adminController.register);
router.post('/login', validate(login), adminController.login);
router.post('/refresh-token', adminController.refreshToken);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/logout', adminController.logout);
router.get('/profile', adminController.getProfile);
router.put('/profile', validate(updateProfile), adminController.updateProfile);
router.get('/users', adminController.getAllUsers);

export default router;
