import { OAuth2Client } from 'google-auth-library';
import BaseService from '../../core/BaseService';
import userRepository from './user.repository';
import AppError from '../../core/errors/AppError';
import { signToken, verifyToken } from '../../utils/jwt';
import env from '../../config/env';
import { redisClient } from '../../config/redis';
import { IUser } from './user.interface';

const googleClient = new OAuth2Client(env.googleClientId);

class UserService extends BaseService<IUser> {
  constructor() {
    super(userRepository);
  }

  async register(data: Partial<IUser>): Promise<IUser> {
    const existingUser = await (this.repository as any).findByEmail(data.email as string);
    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }
    const user = await this.repository.create({
      name: data.name,
      email: data.email,
      password: data.password
    });
    user.password = undefined;
    return user;
  }

  async login(email: string, password: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const user = await (this.repository as any).findByEmail(email, true);
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    const payload = { id: user._id as string, role: user.role };
    const accessToken = signToken(payload, env.jwtExpiresIn);
    const refreshToken = signToken(payload, env.jwtRefreshExpiresIn);
    
    user.password = undefined;
    return { user, accessToken, refreshToken };
  }

  async logout(token: string): Promise<boolean> {
    await redisClient.setEx(`bl_${token}`, 60 * 60 * 24, 'blacklisted'); 
    return true;
  }

  async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    if (!token) throw new AppError('Refresh token is required', 401);
    
    let decoded: any;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      throw new AppError('Invalid refresh token', 401);
    }
    
    const user = await this.getById(decoded.id);
    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    const payload = { id: user._id.toString(), role: user.role };
    const accessToken = signToken(payload, env.jwtExpiresIn);
    const newRefreshToken = signToken(payload, env.jwtRefreshExpiresIn);
    
    return { accessToken, refreshToken: newRefreshToken };
  }

  async getProfile(userId: string): Promise<IUser> {
    return await this.getById(userId);
  }

  async updateProfile(userId: string, updateData: Partial<IUser>): Promise<IUser> {
    delete updateData.password;
    delete updateData.role;
    return await this.update(userId, updateData);
  }

  async googleAuth(data: { email: string; name: string; googleId: string; avatar?: string }): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    let user = await (this.repository as any).findByEmail(data.email);
    
    if (!user) {
      user = await this.repository.create({
        name: data.name,
        email: data.email,
        provider: 'google',
        googleId: data.googleId,
        avatar: data.avatar,
      });
    } else {
      let needsSave = false;
      if (user.provider !== 'google') {
        user.provider = 'google';
        user.googleId = data.googleId;
        needsSave = true;
      }
      if (data.avatar && !user.avatar) {
        user.avatar = data.avatar;
        needsSave = true;
      }
      if (user.status === 'inactive') {
        user.status = 'active';
        needsSave = true;
      }
      if (needsSave) {
        await user.save();
      }
    }

    const payload = { id: user._id as string, role: user.role };
    const accessToken = signToken(payload, env.jwtExpiresIn);
    const refreshToken = signToken(payload, env.jwtRefreshExpiresIn);

    return { user, accessToken, refreshToken };
  }

  async appleAuth(data: { email: string; name: string; appleId: string }): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    let user = await (this.repository as any).findByEmail(data.email);
    
    if (!user) {
      user = await this.repository.create({
        name: data.name || 'Apple User',
        email: data.email,
        provider: 'apple',
        appleId: data.appleId,
      });
    } else {
      let needsSave = false;
      if (user.provider !== 'apple') {
        user.provider = 'apple';
        user.appleId = data.appleId;
        needsSave = true;
      }
      if (user.status === 'inactive') {
        user.status = 'active';
        needsSave = true;
      }
      if (needsSave) {
        await user.save();
      }
    }

    const payload = { id: user._id as string, role: user.role };
    const accessToken = signToken(payload, env.jwtExpiresIn);
    const refreshToken = signToken(payload, env.jwtRefreshExpiresIn);

    return { user, accessToken, refreshToken };
  }
  async toggleWishlist(userId: string, projectId: string): Promise<IUser> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Initialize wishlist if undefined
    if (!user.wishlist) {
      user.wishlist = [];
    }

    const projectIdStr = projectId.toString();
    const index = user.wishlist.findIndex((id: any) => id.toString() === projectIdStr);
    
    if (index > -1) {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
    } else {
      // Add to wishlist
      user.wishlist.push(projectId as any);
    }

    await user.save();
    return user;
  }

  async getWishlist(userId: string): Promise<any> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    // We populate the wishlist items from the Project collection
    const populatedUser = await user.populate({
      path: 'wishlist',
      select: 'title images location emirate price status category urlSlug'
    });
    return populatedUser.wishlist || [];
  }

  async deleteAccount(userId: string): Promise<void> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    user.status = 'inactive';
    await user.save();
  }
}

export default new UserService();
