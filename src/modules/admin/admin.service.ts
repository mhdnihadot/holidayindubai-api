import BaseService from '../../core/BaseService';
import adminRepository from './admin.repository';
import AppError from '../../core/errors/AppError';
import { signToken, verifyToken } from '../../utils/jwt';
import env from '../../config/env';
import { redisClient } from '../../config/redis';
import { IAdmin } from './admin.interface';
import User from '../user/user.model';

class AdminService extends BaseService<IAdmin> {
  constructor() {
    super(adminRepository);
  }

  async register(data: Partial<IAdmin>): Promise<IAdmin> {
    const existingAdmin = await (this.repository as any).findByEmail(data.email as string);
    if (existingAdmin) {
      throw new AppError('Email already exists', 400);
    }
    const admin = await this.repository.create({
      name: data.name,
      email: data.email,
      password: data.password
    });
    admin.password = undefined;
    return admin;
  }

  async login(email: string, password: string): Promise<{ admin: IAdmin; accessToken: string; refreshToken: string }> {
    const admin = await (this.repository as any).findByEmail(email, true);
    if (!admin || !(await admin.correctPassword(password, admin.password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    const payload = { id: admin._id.toString(), role: admin.role };
    const accessToken = signToken(payload, env.jwtExpiresIn);
    const refreshToken = signToken(payload, env.jwtRefreshExpiresIn);
    
    admin.password = undefined;
    return { admin, accessToken, refreshToken };
  }

  async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    if (!token) throw new AppError('Refresh token is required', 401);
    
    let decoded: any;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      throw new AppError('Invalid refresh token', 401);
    }
    
    const admin = await this.getById(decoded.id);
    if (!admin) {
      throw new AppError('Admin no longer exists', 401);
    }

    const payload = { id: admin._id.toString(), role: admin.role };
    const accessToken = signToken(payload, env.jwtExpiresIn);
    const newRefreshToken = signToken(payload, env.jwtRefreshExpiresIn);
    
    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(token: string): Promise<boolean> {
    await redisClient.setEx(`bl_${token}`, 60 * 60 * 24, 'blacklisted'); 
    return true;
  }

  async getProfile(adminId: string): Promise<IAdmin> {
    return await this.getById(adminId);
  }

  async updateProfile(adminId: string, updateData: Partial<IAdmin>): Promise<IAdmin> {
    delete updateData.password;
    delete updateData.role;
    return await this.update(adminId, updateData);
  }

  async getAllUsers() {
    return await User.find().select('-password -__v').sort({ createdAt: -1 });
  }
}

export default new AdminService();
