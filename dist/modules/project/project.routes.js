"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_controller_1 = __importDefault(require("./project.controller"));
const validate_middleware_1 = __importDefault(require("../../middlewares/validate.middleware"));
const project_validation_1 = require("./project.validation");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = express_1.default.Router();
// Public routes (read-only)
router.get('/', project_controller_1.default.getAllProjects);
router.get('/:id', project_controller_1.default.getById);
// Admin only routes
router.use(auth_middleware_1.protect);
router.use((0, auth_middleware_1.restrictTo)('admin'));
router.post('/', (0, validate_middleware_1.default)(project_validation_1.createProject), project_controller_1.default.createProject);
router.put('/:id', (0, validate_middleware_1.default)(project_validation_1.updateProject), project_controller_1.default.update);
router.delete('/:id', project_controller_1.default.delete);
exports.default = router;
