import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  phone?: string;
  wishlist?: any[];
  provider?: 'local' | 'google' | 'apple';
  googleId?: string;
  appleId?: string;
  role: string;
  status?: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  correctPassword(candidatePassword: string, userPassword?: string): Promise<boolean>;
}
