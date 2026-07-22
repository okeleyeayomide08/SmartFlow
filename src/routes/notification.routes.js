import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getMyNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";


const router = Router();


router.get("/", authMiddleware, getMyNotifications);
router.patch("/:id/read", authMiddleware, markAsRead);
router.delete("/:id", authMiddleware, deleteNotification);


export default router;
