import { validationResult } from "express-validator";
import pool from "../config/db.js";
import { sendSuccess, sendError } from "../helpers/response.helper.js";

async function createTeam(req, res, next) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructring Object
    const { name, description } = req.body;

    // Check if team name already exists and return error message
    const [rows] = await pool.query("SELECT * FROM teams WHERE name = ?", [
      name,
    ]);

    if (rows.length > 0) {
      return sendError(res, "Team name already exists", 409);
    }

    // Insert into the team table
    const [result] = await pool.query(
      "INSERT INTO teams (name, description) VALUES (?, ?)",
      [name, description],
    );

    // Send success message
    return sendSuccess(
      res,
      "Team Created Successfuly",
      {
        teamId: result.insertId,
        teamName: name,
      },
      201,
    );
  } catch (error) {
    next(error);
  }
}

async function getAllTeams(req, res, next) {
  try {
    // Get all teams from database
    const [rows] = await pool.query("SELECT * FROM teams");

    // If team table is empty
    if (rows.length === 0) {
      return sendSuccess(res, "No teams found");
    }

    return sendSuccess(res, "All teams retrieved successfully", {
      teams: rows,
    });
  } catch (error) {
    next(error);
  }
}

async function getTeamById(req, res, next) {
  try {
    // Get id from rquest
    const { id } = req.params;

    // Get a team from database
    const [rows] = await pool.query("SELECT * FROM teams WHERE id = ?", [id]);

    // If team is not found
    if (rows.length === 0) {
      return sendError(res, "Team not found", 404);
    }

    return sendSuccess(res, `Retrieved team with id ${id}`, { team: rows[0] });
  } catch (error) {
    next(error);
  }
}

async function updateTeam(req, res, next) {
  try {
    // Get id from rquest
    const { id } = req.params;

    // Destructring Object
    const { name, description } = req.body;

    // Check If team exist first
    const [rows] = await pool.query("SELECT * FROM teams WHERE id = ?", [id]);

    // If team is not found
    if (rows.length === 0) {
      return sendError(res, "Team not found", 404);
    }

    const currentTeam = rows[0];
    // Prevent duplicate names if the name is being changed
    if (name && name !== currentTeam.name) {
      const [duplicateCheck] = await pool.query(
        "SELECT * FROM teams WHERE name = ? AND id != ?",
        [name, id],
      );
      if (duplicateCheck.length > 0) {
        return sendError(res, "Team name already exists", 409);
      }
    }

    // Fallback to existing values if fields are missing in req.body
    const updatedName = name ?? currentTeam.name;
    const updatedDescription = description ?? currentTeam.description;

    // Update the team in table
    await pool.query(
      "UPDATE teams SET name = ?, description = ? WHERE id = ?",
      [updatedName, updatedDescription, id],
    );

    return sendSuccess(res, "Team updated successfully");
  } catch (error) {
    next(error);
  }
}

async function deleteTeam(req, res, next) {
  try {
    // Get id from rquest
    const { id } = req.params;

    // Check If team exist first
    const [rows] = await pool.query("SELECT * FROM teams WHERE id = ?", [id]);

    // If team is not found
    if (rows.length === 0) {
      return sendError(res, "Team not found", 404);
    }

    // Delete the team
    await pool.query("DELETE FROM teams WHERE id = ?", [id]);

    return sendSuccess(res, "Team deleted successfully");
  } catch (error) {
    next(error);
  }
}

export { createTeam, getAllTeams, getTeamById, updateTeam, deleteTeam };
