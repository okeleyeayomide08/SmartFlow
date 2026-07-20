import { body } from "express-validator";

const createTaskValidator = [
  body("name").trim().notEmpty().withMessage("Task name is required"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium or high"),

  body("deadline")
    .optional()
    .isDate()
    .withMessage("Deadline must be a valid date"),

  body("project_id")
    .notEmpty()
    .withMessage("Project ID is required")
    .isInt()
    .withMessage("Project ID must be an integer"),

  body("assigned_to")
    .notEmpty()
    .withMessage("Assigned user ID is required")
    .isInt()
    .withMessage("Assigned user ID must be an integer"),
];

const updateTaskStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "in_progress", "completed"])
    .withMessage("Status must be pending, in_progress or completed"),
];

export { createTaskValidator, updateTaskStatusValidator };
