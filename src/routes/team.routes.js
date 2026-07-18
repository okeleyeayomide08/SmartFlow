import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import {
  createTeamValidator,
  updateTeamValidator,
} from "../validators/team.validator.js";
import {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
} from "../controllers/team.controller.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createTeamValidator,
  createTeam,
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  getAllTeams,
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  getTeamById,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateTeamValidator,
  updateTeam,
);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteTeam);

export default router;
