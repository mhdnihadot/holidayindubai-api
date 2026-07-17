import express from 'express';
import userController from './user.controller';
import validate from '../../middlewares/validate.middleware';
import { register, login, updateProfile } from './user.validation';
import { protect, restrictTo } from '../../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', validate(register), userController.register);
router.post('/login', validate(login), userController.login);
router.post('/google-auth', userController.googleAuth);
router.post('/apple-auth', userController.appleAuth);
router.post('/refresh-token', userController.refreshToken);

router.use(protect);
router.use(restrictTo('user'));

router.post('/logout', userController.logout);
router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfile), userController.updateProfile);
router.get('/wishlist', userController.getWishlist);
router.post('/wishlist/:projectId', userController.toggleWishlist);
router.delete('/account', userController.deleteAccount);

export default router;
