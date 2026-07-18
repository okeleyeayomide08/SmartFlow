import { body } from "express-validator";

const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .notEmpty()
    .isIn(["admin", "manager", "employee"])
    .withMessage("Role must be admin, manager or employee"),
];

const loginValidator = [
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

export { registerValidator, loginValidator };
