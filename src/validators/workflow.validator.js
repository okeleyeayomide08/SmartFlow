import { body } from "express-validator";

const createWorkflowValidator = [
  body("name").trim().notEmpty().withMessage("Workflow name is required"),

  body("project_id")
    .notEmpty()
    .withMessage("Project ID is required")
    .isInt()
    .withMessage("Project ID must be an integer"),

  body("trigger_event")
    .notEmpty()
    .withMessage("Trigger event is required")
    .isIn(["task_status_changed"])
    .withMessage("Invalid trigger event"),

  body("condition_field")
    .notEmpty()
    .withMessage("Condition field is required")
    .isIn(["status"])
    .withMessage("Invalid condition field"),

  body("condition_operator")
    .notEmpty()
    .withMessage("Condition operator is required")
    .isIn(["equals"])
    .withMessage("Invalid condition operator"),

  body("condition_value")
    .notEmpty()
    .withMessage("Condition value is required")
    .isIn(["pending", "in_progress", "completed"])
    .withMessage("Invalid condition value"),

  body("action_type")
    .notEmpty()
    .withMessage("Action type is required")
    .isIn(["notify_manager", "notify_employee"])
    .withMessage("Invalid action type"),
];

const updateWorkflowValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Workflow name cannot be empty"),

  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be a boolean"),

  body("action_type")
    .optional()
    .isIn(["notify_manager", "notify_employee"])
    .withMessage("Invalid action type"),
];

export { createWorkflowValidator, updateWorkflowValidator };
