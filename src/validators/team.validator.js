import { body } from "express-validator";

const createTeamValidator = [
  body("name").trim().notEmpty().withMessage("Team name is required"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];

const updateTeamValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Team name cannot be empty"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];

export { createTeamValidator, updateTeamValidator };
