import { body } from "express-validator";

const updateUserValidator = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
];

const assignTeamValidator = [
  body("team_id")
    .notEmpty()
    .withMessage("Team ID is required")
    .isInt()
    .withMessage("Team ID must be an integer"),
];

export { updateUserValidator, assignTeamValidator };
