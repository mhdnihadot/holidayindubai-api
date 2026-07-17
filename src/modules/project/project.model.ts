import mongoose, { Schema } from 'mongoose';
import { IProject } from './project.interface';

const projectSchema: Schema<IProject> = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A project must have a title'],
    trim: true,
  },
  subtitle: { type: String },
  description: {
    type: String,
    required: [true, 'A project must have a description'],
  },
  location: { type: String },
  googleMapUrl: { type: String },
  emirate: {
    type: String,
    enum: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah', '']
  },
  category: { type: String },
  duration: { type: String },
  bestTime: { type: String },
  bestSeason: { type: String },
  outdoor: { type: Boolean },
  highlights: [{
    icon: { type: String },
    text: { type: String }
  }],
  idealFor: [{
    icon: { type: String },
    text: { type: String }
  }],
  distanceFromCity: { type: String },
  nearbyLandmarks: [{ type: String }],
  dressCode: {
    recommended: { type: String },
    avoid: { type: String }
  },
  safetyAndComfort: [{
    icon: { type: String },
    title: { type: String },
    description: { type: String }
  }],
  accessibility: [{
    icon: { type: String },
    title: { type: String },
    description: { type: String }
  }],
  experienceSteps: [{
    title: { type: String },
    content: { type: String }
  }],
  platformUrl: { type: String, trim: true },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  },
  images: {
    type: [String],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'A project must belong to an admin']
  }
}, { timestamps: true });

const Project = mongoose.model<IProject>('Project', projectSchema);
export default Project;
