import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import {
  createTaskValidator,
  updateTaskStatusValidator,
} from "../validators/task.validator.js";
import {
  createTask,
  getAllTasks,
  getTaskById,
  getMyTasks,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  createTaskValidator,
  createTask,
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  getAllTasks,
);

router.get("/my-tasks", authMiddleware, getMyTasks);

router.get("/:id", authMiddleware, getTaskById);

router.patch(
  "/:id/status",
  authMiddleware,
  updateTaskStatusValidator,
  updateTaskStatus,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  deleteTask,
);

export default router;
