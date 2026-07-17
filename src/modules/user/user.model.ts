import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from './user.interface';

const userSchema: Schema<IUser> = new mongoose.Schema({
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
    required: [
      function(this: any) {
        return this.provider === 'local' || !this.provider;
      },
      'Please provide a password'
    ],
    minlength: 8,
    select: false,
  },
  avatar: String,
  phone: {
    type: String,
    trim: true,
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  provider: {
    type: String,
    enum: ['local', 'google', 'apple'],
    default: 'local',
  },
  googleId: String,
  appleId: String,
  role: {
    type: String,
    enum: ['user'],
    default: 'user',
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, { timestamps: true });

userSchema.pre('save', async function(this: any) {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.correctPassword = async function(candidatePassword: string, userPassword?: string): Promise<boolean> {
  if (!userPassword) return false;
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
