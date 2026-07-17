import { Request, Response, NextFunction } from 'express';
import BaseController from '../../core/BaseController';
import adminService from './admin.service';
import { sendSuccess } from '../../utils/response';
import catchAsync from '../../utils/catchAsync';
import AdminDTO from './admin.dto';
import { IAdmin } from './admin.interface';

class AdminController extends BaseController<IAdmin> {
  constructor() {
    super(adminService, 'Admin');
    this.login = catchAsync(this.login.bind(this));
    this.logout = catchAsync(this.logout.bind(this));
    this.getProfile = catchAsync(this.getProfile.bind(this));
    this.updateProfile = catchAsync(this.updateProfile.bind(this));
    this.register = catchAsync(this.register.bind(this));
    this.refreshToken = catchAsync(this.refreshToken.bind(this));
    this.getAllUsers = catchAsync(this.getAllUsers.bind(this));
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    const admin = await (this.service as any).register(req.body);
    sendSuccess(res, 201, 'Admin registered successfully', AdminDTO.fromEntity(admin));
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const data = await (this.service as any).login(req.body.email, req.body.password);
    const isMobile = req.headers['is-mobile'] === 'true';

    if (isMobile) {
      sendSuccess(res, 200, 'Admin logged in successfully', {
        admin: AdminDTO.fromEntity(data.admin),
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      });
    } else {
      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      sendSuccess(res, 200, 'Admin logged in successfully', {
        admin: AdminDTO.fromEntity(data.admin),
        token: data.accessToken
      });
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Attempt to extract token from cookies or body
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    const data = await (this.service as any).refreshToken(token);
    
    const isMobile = req.headers['is-mobile'] === 'true';

    if (isMobile) {
      sendSuccess(res, 200, 'Token refreshed successfully', {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      });
    } else {
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
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    await (this.service as any).logout(req.token as string);
    sendSuccess(res, 200, 'Admin logged out successfully');
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    const admin = await (this.service as any).getProfile(req.user?.id);
    sendSuccess(res, 200, 'Profile retrieved successfully', AdminDTO.fromEntity(admin));
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    const admin = await (this.service as any).updateProfile(req.user?.id, req.body);
    sendSuccess(res, 200, 'Profile updated successfully', AdminDTO.fromEntity(admin));
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    const users = await (this.service as any).getAllUsers();
    sendSuccess(res, 200, 'Users retrieved successfully', users);
  }
}

export default new AdminController();
