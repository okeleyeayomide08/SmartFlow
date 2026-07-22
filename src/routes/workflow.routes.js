import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import {
  createWorkflowValidator,
  updateWorkflowValidator,
} from "../validators/workflow.validator.js";
import {
  createWorkflow,
  getAllWorkflows,
  getWorkflowById,
  updateWorkflow,
  deleteWorkflow,
} from "../controllers/workflow.controller.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  createWorkflowValidator,
  createWorkflow,
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  getAllWorkflows,
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  getWorkflowById,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  updateWorkflowValidator,
  updateWorkflow,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  deleteWorkflow,
);

export default router;
