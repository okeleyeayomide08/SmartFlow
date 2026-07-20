import { body } from "express-validator";

const createProjectValidator = [
  body("name").trim().notEmpty().withMessage("Project name is required"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("team_id")
    .notEmpty()
    .withMessage("Team ID is required")
    .isInt()
    .withMessage("Team ID must be an integer"),
  body("deadline")
    .optional()
    .isDate()
    .withMessage("Deadline must be a valid date"),
];

const updateProjectValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Project name cannot be empty"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("status")
    .optional()
    .isIn(["active", "completed", "on_hold"])
    .withMessage("Status must be active, completed or on_hold"),
  body("deadline")
    .optional()
    .isDate()
    .withMessage("Deadline must be a valid date"),
];

export { createProjectValidator, updateProjectValidator };
