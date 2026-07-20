import { validationResult } from "express-validator";
import pool from "../config/db.js";
import { sendSuccess, sendError } from "../helpers/response.helper.js";
import {
  sendTaskAssignedEmail,
  sendTaskCompletedEmail,
} from "../services/email.service.js";

async function createTask(req, res, next) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract Infromation from the body
    const { name, description, priority, deadline, project_id, assigned_to } =
      req.body;

    const createdBy = req.user.userId;

    // Search if project exist
    const [projectRows] = await pool.query(
      "SELECT id, name FROM projects WHERE id = ?",
      [project_id],
    );

    if (projectRows.length === 0) {
      return sendError(res, "Project not found", 404);
    }

    // Getting project details
    const project = projectRows[0];

    const [userRows] = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [assigned_to],
    );

    if (userRows.length === 0) {
      return sendError(res, "Assigned user not found", 404);
    }

    const user = userRows[0];

    // Check if role is employee
    if (user.role !== "employee") {
      return sendError(res, "Tasks can only be assigned to employees", 400);
    }

    // Inserting the task
    const [result] = await pool.query(
      "INSERT INTO tasks (name, description, priority, deadline, project_id, assigned_to, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        description,
        priority,
        deadline,
        project_id,
        assigned_to,
        createdBy,
      ],
    );

    // Sending task assigned Email
    await sendTaskAssignedEmail(
      user.email,
      user.name,
      name,
      project.name,
      deadline,
      priority,
    );

    return sendSuccess(
      res,
      "Task created successfully",
      { taskId: result.insertId },
      201,
    );
  } catch (error) {
    next(error);
  }
}

async function getAllTasks(req, res, next) {
  try {
    const [taskRows] = await pool.query(
      "SELECT tasks.*, users.name AS assigned_to_name, projects.name AS project_name FROM tasks LEFT JOIN users ON tasks.assigned_to = users.id LEFT JOIN projects ON tasks.project_id = projects.id",
    );

    if (taskRows.length === 0) {
      return sendSuccess(res, "No tasks found");
    }

    return sendSuccess(res, "All Tasks retrived", { tasks: taskRows });
  } catch (error) {
    next(error);
  }
}

async function getTaskById(req, res, next) {
  try {
    const { id } = req.params;

    const [taskRows] = await pool.query(
      "SELECT tasks.*, users.name AS assigned_to_name, projects.name AS project_name FROM tasks LEFT JOIN users ON tasks.assigned_to = users.id LEFT JOIN projects ON tasks.project_id = projects.id WHERE tasks.id = ?",
      [id],
    );

    if (taskRows.length === 0) {
      return sendError(res, "Task not found", 404);
    }

    const task = taskRows[0];

    if (req.user.role === "employee" && task.assigned_to !== req.user.userId) {
      return sendError(res, "Access denied", 403);
    }

    return sendSuccess(res, "Task retrieved successfully", { task: task });
  } catch (error) {
    next(error);
  }
}

async function getMyTasks(req, res, next) {
  try {
    const { userId } = req.user;

    const [taskRows] = await pool.query(
      "SELECT tasks.*, projects.name AS project_name FROM tasks LEFT JOIN projects ON tasks.project_id = projects.id WHERE tasks.assigned_to = ?",
      [userId],
    );

    if (taskRows.length === 0) {
      return sendSuccess(res, "No tasks assigned to you");
    }

    return sendSuccess(res, "Your tasks retrieved successfully", {
      tasks: taskRows,
    });
  } catch (error) {
    next(error);
  }
}

async function updateTaskStatus(req, res, next) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const { status } = req.body;

    const [taskRows] = await pool.query(
      "SELECT tasks.*, users.email AS assigned_user_email, users.name AS assigned_user_name FROM tasks LEFT JOIN users ON tasks.assigned_to = users.id WHERE tasks.id = ?",
      [id],
    );

    if (taskRows.length === 0) {
      return sendError(res, "Task not found", 404);
    }

    const task = taskRows[0];

    if (req.user.role === "employee" && task.assigned_to !== req.user.userId) {
      return sendError(res, "Access denied", 403);
    }

    await pool.query("UPDATE tasks SET status = ? WHERE id = ?", [status, id]);

    if (status === "completed") {
      const [managerRows] = await pool.query(
        "SELECT name, email FROM users WHERE id = ?",
        [task.created_by],
      );
      if (managerRows.length > 0) {
        const manager = managerRows[0];
        await sendTaskCompletedEmail(
          manager.email,
          manager.name,
          task.name,
          task.assigned_user_name,
        );
      }
    }

    return sendSuccess(res, "Task status updated successfully");
  } catch (error) {
    next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;

    const [taskRows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [
      id,
    ]);

    if (taskRows.length === 0) {
      return sendError(res, "Task not found", 404);
    }

    const task = taskRows[0];

    if (req.user.role === "manager" && task.created_by !== req.user.userId) {
      return sendError(res, "Access denied", 403);
    }

    await pool.query("DELETE FROM tasks WHERE id = ?", [id]);

    return sendSuccess(res, "Task deleted successfully");
  } catch (error) {
    next(error);
  }
}

export {
  createTask,
  getAllTasks,
  getTaskById,
  getMyTasks,
  updateTaskStatus,
  deleteTask,
};
