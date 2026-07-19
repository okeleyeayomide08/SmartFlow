import { validationResult } from "express-validator";
import pool from "../config/db.js";
import { sendSuccess, sendError } from "../helpers/response.helper.js";

async function getAllUsers(req, res, next) {
  try {
    // Get all users from database
    const [rows] = await pool.query(
      "SELECT id, name, email, role, team_id, created_at FROM users",
    );

    // If user table is empty
    if (rows.length === 0) {
      return sendSuccess(res, "No user found");
    }

    return sendSuccess(res, "All users retrieved successfully", {
      users: rows,
    });
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    // Getting UserId, requestedId and role to check access permissions
    const loggedInUserId = req.user.userId;
    const requestedId = parseInt(req.params.id);

    if (req.user.role === "employee" && loggedInUserId !== requestedId) {
      return sendError(res, "Access denied", 403);
    }

    // Search database for the user
    const [rows] = await pool.query(
      "SELECT id, name, email, role, team_id, created_at FROM users WHERE id = ?",
      [requestedId],
    );

    // If user not found
    if (rows.length === 0) {
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(res, "User found", { user: rows[0] });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Getting UserId, idToUpdate and role to check access permissions
    const loggedInUserId = req.user.userId;
    const idToUpdate = parseInt(req.params.id);

    if (req.user.role === "employee" && loggedInUserId !== idToUpdate) {
      return sendError(res, "Access denied", 403);
    }

    // Search database for the user
    const [rows] = await pool.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [idToUpdate],
    );

    // If user not found
    if (rows.length === 0) {
      return sendError(res, "User not found", 404);
    }

    // Destucturing Data
    const { name, email } = req.body;

    const currentUser = rows[0];
    // Prevent duplicate email if the email is being changed
    if (email && email !== currentUser.email) {
      const [duplicateCheck] = await pool.query(
        "SELECT * FROM users WHERE email = ? AND id != ?",
        [email, idToUpdate],
      );
      if (duplicateCheck.length > 0) {
        return sendError(res, "Email already exists", 409);
      }
    }

    // Fallback to existing values if fields are missing in req.body
    const updatedName = name ?? currentUser.name;
    const updatedEmail = email ?? currentUser.email;

    // Update the user in the table
    await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      updatedName,
      updatedEmail,
      idToUpdate,
    ]);

    return sendSuccess(res, "User updated successfully");
  } catch (error) {
    next(error);
  }
}

async function assignUserToTeam(req, res, next) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Getting Id fron request
    const { id } = req.params;

    // Getting team
    const { team_id } = req.body;

    // Search database for the user
    const [userRows] = await pool.query("SELECT id FROM users WHERE id = ?", [
      id,
    ]);

    // If user not found
    if (userRows.length === 0) {
      return sendError(res, "User not found", 404);
    }

    // Search database for the team
    const [teamRows] = await pool.query("SELECT id FROM teams WHERE id = ?", [
      team_id,
    ]);

    // If team not found
    if (teamRows.length === 0) {
      return sendError(res, "Team not found", 404);
    }

    // Update the user team
    await pool.query("UPDATE users SET team_id = ? WHERE id = ?", [
      team_id,
      id,
    ]);

    return sendSuccess(res, "User assigned to team successfully");
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    // Getting Id fron request
    const { id } = req.params;

    // Search database for the user
    const [userRows] = await pool.query("SELECT id FROM users WHERE id = ?", [
      id,
    ]);

    // If user not found
    if (userRows.length === 0) {
      return sendError(res, "User not found", 404);
    }

    // Check if user has assigned tasks
    const [taskRows] = await pool.query(
      "SELECT id FROM tasks WHERE assigned_to = ?",
      [id],
    );

    if (taskRows.length > 0) {
      return sendError(
        res,
        "Cannot delete user with assigned tasks. Reassign tasks first",
        400,
      );
    }

    // Check if user has created projects
    const [projectRows] = await pool.query(
      "SELECT id FROM projects WHERE created_by = ?",
      [id],
    );

    if (projectRows.length > 0) {
      return sendError(res, "Cannot delete user with created projects", 400);
    }

    await pool.query("DELETE FROM users WHERE id = ?", [id]);

    return sendSuccess(res, "User deleted successfully");
  } catch (error) {
    next(error);
  }
}

export { getAllUsers, getUserById, updateUser, assignUserToTeam, deleteUser };
