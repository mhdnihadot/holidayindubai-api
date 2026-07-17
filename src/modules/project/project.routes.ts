import express from 'express';
import projectController from './project.controller';
import validate from '../../middlewares/validate.middleware';
import { createProject, updateProject } from './project.validation';
import { protect, restrictTo } from '../../middlewares/auth.middleware';

const router = express.Router();

// Public routes (read-only)
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getById);

// Admin only routes
router.use(protect);
router.use(restrictTo('admin'));
router.post('/', validate(createProject), projectController.createProject);
router.put('/:id', validate(updateProject), projectController.update);
router.delete('/:id', projectController.delete);

export default router;
