import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import {
  createProjectValidator,
  updateProjectValidator,
} from "../validators/project.validator.js";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  createProjectValidator,
  createProject,
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  getAllProjects,
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  getProjectById,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  updateProjectValidator,
  updateProject,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  deleteProject,
);

export default router;
