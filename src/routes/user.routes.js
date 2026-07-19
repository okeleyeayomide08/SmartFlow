import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import {
  updateUserValidator,
  assignTeamValidator,
} from "../validators/user.validator.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  assignUserToTeam,
  deleteUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", authMiddleware, roleMiddleware("admin"), getAllUsers);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager", "employee"),
  getUserById,
);

router.patch(
  "/:id/assign-team",
  authMiddleware,
  roleMiddleware("admin"),
  assignTeamValidator,
  assignUserToTeam,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "employee"),
  updateUserValidator,
  updateUser,
);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteUser);

export default router;
