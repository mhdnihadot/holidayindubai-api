import { Document } from 'mongoose';

export interface IAdmin extends Document {
  name: string;
  email: string;
  password?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  correctPassword(candidatePassword: string, userPassword?: string): Promise<boolean>;
}
