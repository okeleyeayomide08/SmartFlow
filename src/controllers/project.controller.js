import { validationResult } from "express-validator";
import pool from "../config/db.js";
import { sendSuccess, sendError } from "../helpers/response.helper.js";

async function createProject(req, res, next) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract body information
    const { name, description, team_id, deadline } = req.body;

    // The logged in user Id
    const createdBy = req.user.userId;

    // Check if team exist
    const [teamRows] = await pool.query("SELECT id FROM teams WHERE id = ?", [
      team_id,
    ]);

    if (teamRows.length === 0) {
      return sendError(res, "Team not found", 404);
    }

    // Check if project name already exists in that team
    const [projectRows] = await pool.query(
      "SELECT id FROM projects WHERE name = ? AND team_id = ?",
      [name, team_id],
    );

    if (projectRows.length > 0) {
      return sendError(res, "Project name already exists in this team", 409);
    }

    // Inserting the Project
    const [result] = await pool.query(
      "INSERT INTO projects (name, description, team_id, deadline, created_by) VALUES (?, ?, ?, ?, ?)",
      [name, description, team_id, deadline, createdBy],
    );

    return sendSuccess(
      res,
      "Project Created",
      { projectId: result.insertId },
      201,
    );
  } catch (error) {
    next(error);
  }
}

async function getAllProjects(req, res, next) {
  try {
    // Get all the projects
    const [projectRows] = await pool.query(
      "SELECT projects.*, teams.name AS team_name FROM projects LEFT JOIN teams ON projects.team_id = teams.id",
    );

    if (projectRows.length === 0) {
      return sendSuccess(res, "No projects found");
    }

    return sendSuccess(res, "Retrieved all projects", {
      projects: projectRows,
    });
  } catch (error) {
    next(error);
  }
}

async function getProjectById(req, res, next) {
  try {
    // Get the project id
    const { id } = req.params;

    // Search for the project
    const [projectRows] = await pool.query(
      "SELECT projects.*, teams.name AS team_name FROM projects LEFT JOIN teams ON projects.team_id = teams.id WHERE projects.id = ?",
      [id],
    );

    if (projectRows.length === 0) {
      return sendError(res, "Project not found", 404);
    }

    return sendSuccess(res, "Retrieved Project", { project: projectRows[0] });
  } catch (error) {
    next(error);
  }
}
async function updateProject(req, res, next) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get the project id
    const { id } = req.params;

    // Search for the project
    const [projectRows] = await pool.query(
      "SELECT * FROM projects WHERE id = ?",
      [id],
    );

    if (projectRows.length === 0) {
      return sendError(res, "Project not found", 404);
    }

    const project = projectRows[0];
    // Check ownership for managers
    if (req.user.role === "manager" && project.created_by !== req.user.userId) {
      return sendError(res, "Access denied", 403);
    }

    // Extract fields and build fallbacks
    const { name, description, status, deadline } = req.body;
    const updatedName = name ?? project.name;
    const updatedDescription = description ?? project.description;
    const updatedStatus = status ?? project.status;
    const updatedDeadline = deadline ?? project.deadline;

    await pool.query(
      "UPDATE projects SET name = ?, description = ?, status = ?, deadline = ? WHERE id = ?",
      [updatedName, updatedDescription, updatedStatus, updatedDeadline, id],
    );

    return sendSuccess(res, "Project updated successfully");
  } catch (error) {
    next(error);
  }
}

async function deleteProject(req, res, next) {
  try {
    // Get the project id
    const { id } = req.params;

    // Search for the project
    const [projectRows] = await pool.query(
      "SELECT * FROM projects WHERE id = ?",
      [id],
    );

    if (projectRows.length === 0) {
      return sendError(res, "Project not found", 404);
    }

    const project = projectRows[0];

    // Check ownership for managers
    if (req.user.role === "manager" && project.created_by !== req.user.userId) {
      return sendError(res, "Access denied", 403);
    }

    // Check if project has tasks
    const [taskRows] = await pool.query(
      "SELECT id FROM tasks WHERE project_id = ?",
      [id],
    );

    if (taskRows.length > 0) {
      return sendError(
        res,
        "Cannot delete project with existing tasks. Delete tasks first",
        400,
      );
    }

    await pool.query("DELETE FROM projects WHERE id = ?", [id]);

    return sendSuccess(res, "Project deleted successfully");
  } catch (error) {
    next(error);
  }
}

export {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
