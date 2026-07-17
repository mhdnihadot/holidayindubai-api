import { Request, Response, NextFunction } from 'express';
import BaseController from '../../core/BaseController';
import userService from './user.service';
import { sendSuccess } from '../../utils/response';
import catchAsync from '../../utils/catchAsync';
import UserDTO from './user.dto';
import { IUser } from './user.interface';
import AppError from '../../core/errors/AppError';

class UserController extends BaseController<IUser> {
  constructor() {
    super(userService, 'User');
    this.register = catchAsync(this.register.bind(this));
    this.login = catchAsync(this.login.bind(this));
    this.logout = catchAsync(this.logout.bind(this));
    this.getProfile = catchAsync(this.getProfile.bind(this));
    this.updateProfile = catchAsync(this.updateProfile.bind(this));
    this.googleAuth = catchAsync(this.googleAuth.bind(this));
    this.appleAuth = catchAsync(this.appleAuth.bind(this));
    this.toggleWishlist = catchAsync(this.toggleWishlist.bind(this));
    this.getWishlist = catchAsync(this.getWishlist.bind(this));
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = await (this.service as any).register(req.body);
    sendSuccess(res, 201, 'User registered successfully', UserDTO.fromEntity(user));
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const data = await (this.service as any).login(req.body.email, req.body.password);

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    sendSuccess(res, 200, 'User logged in successfully', {
      user: UserDTO.fromEntity(data.user),
      token: data.accessToken
    });
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    await (this.service as any).logout(req.token as string);
    sendSuccess(res, 200, 'User logged out successfully');
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    const data = await (this.service as any).refreshToken(token);

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    sendSuccess(res, 200, 'Token refreshed successfully', {
      token: data.accessToken
    });
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = await (this.service as any).getProfile(req.user?.id);
    sendSuccess(res, 200, 'Profile retrieved successfully', UserDTO.fromEntity(user));
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = await (this.service as any).updateProfile(req.user?.id, req.body);
    sendSuccess(res, 200, 'Profile updated successfully', UserDTO.fromEntity(user));
  }

  async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    const data = await (this.service as any).googleAuth(req.body);

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    sendSuccess(res, 200, 'User authenticated with Google successfully', {
      user: UserDTO.fromEntity(data.user),
      token: data.accessToken
    });
  }

  async appleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { identityToken, name } = req.body;

    if (!identityToken) {
      return next(new AppError('Identity token is required', 400));
    }

    try {
      const appleAuth = require('apple-signin-auth');
      const decoded = await appleAuth.verifyIdToken(identityToken, {
        ignoreExpiration: false,
      });

      const email = decoded.email;
      const appleId = decoded.sub;

      if (!email) {
        return next(new AppError('Email is required from Apple Sign-In', 400));
      }

      const data = await (this.service as any).appleAuth({
        email,
        name: name || '',
        appleId,
      });

      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      sendSuccess(res, 200, 'User authenticated with Apple successfully', {
        user: UserDTO.fromEntity(data.user),
        token: data.accessToken
      });
    } catch (error) {
      console.error('Apple Auth Error:', error);
      return next(new AppError('Invalid Apple Identity Token', 401));
    }
  }


  async toggleWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = await (this.service as any).toggleWishlist(req.user?.id, req.params.projectId);
    sendSuccess(res, 200, 'Wishlist updated successfully', UserDTO.fromEntity(user));
  }

  async getWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
    const wishlist = await (this.service as any).getWishlist(req.user?.id);
    sendSuccess(res, 200, 'Wishlist retrieved successfully', wishlist);
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    await (this.service as any).deleteAccount(req.user?.id);
    sendSuccess(res, 200, 'Account deleted successfully', null);
  }
}

export default new UserController();
