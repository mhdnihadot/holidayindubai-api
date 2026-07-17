import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IAdmin } from './admin.interface';

const adminSchema: Schema<IAdmin> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin',
  },
}, { timestamps: true });

adminSchema.pre('save', async function(this: any) {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

adminSchema.methods.correctPassword = async function(candidatePassword: string, userPassword?: string): Promise<boolean> {
  if (!userPassword) return false;
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
export default Admin;
