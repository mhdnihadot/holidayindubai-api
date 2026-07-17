import { Document, Types } from 'mongoose';
import { IAdmin } from '../admin/admin.interface';

export interface IProject extends Document {
  title: string;
  subtitle?: string;
  description: string;
  location?: string;
  googleMapUrl?: string;
  emirate?: string;
  category?: string;
  duration?: string;
  bestTime?: string;
  bestSeason?: string;
  outdoor?: boolean;
  highlights?: { icon: string; text: string }[];
  idealFor?: { icon: string; text: string }[];
  distanceFromCity?: string;
  nearbyLandmarks?: string[];
  dressCode?: { recommended?: string; avoid?: string };
  safetyAndComfort?: { icon: string; title: string; description: string }[];
  accessibility?: { icon: string; title: string; description: string }[];
  experienceSteps?: { title: string; content: string }[];
  platformUrl?: string;
  status: 'active' | 'inactive' | 'completed';
  images: string[];
  createdBy: Types.ObjectId | IAdmin | string;
  createdAt: Date;
  updatedAt: Date;
}
