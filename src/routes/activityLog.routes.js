import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import {
  getAllLogs,
  getLogById,
} from "../controllers/activityLog.controller.js";

const router = Router();

router.get("/", authMiddleware, roleMiddleware("admin", "manager"), getAllLogs);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  getLogById,
);

export default router;
