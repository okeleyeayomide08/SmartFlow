import { Router } from "express";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);

export default router;
