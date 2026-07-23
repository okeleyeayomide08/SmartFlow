import { validationResult } from "express-validator";
import pool from "../config/db.js";
import { sendSuccess, sendError } from "../helpers/response.helper.js";

async function createWorkflow(req, res, next) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      project_id,
      trigger_event,
      condition_field,
      condition_operator,
      condition_value,
      action_type,
    } = req.body;

    const createdBy = req.user.userId;

    const [projectRows] = await pool.query(
      "SELECT id FROM projects WHERE id = ?",
      [project_id],
    );

    if (projectRows.length === 0) {
      return sendError(res, "Project not found", 404);
    }

    const [workflowRows] = await pool.query(
      "SELECT id FROM workflows WHERE name = ? AND project_id = ?",
      [name, project_id],
    );

    if (workflowRows.length > 0) {
      return sendError(
        res,
        "Workflow name already exists in this project",
        409,
      );
    }

    const [result] = await pool.query(
      "INSERT INTO workflows (name, project_id, trigger_event, condition_field, condition_operator, condition_value, action_type, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        project_id,
        trigger_event,
        condition_field,
        condition_operator,
        condition_value,
        action_type,
        createdBy,
      ],
    );

    return sendSuccess(
      res,
      "Workflow created",
      {
        workflowId: result.insertId,
      },
      201,
    );
  } catch (error) {
    next(error);
  }
}

async function getAllWorkflows(req, res, next) {
  try {
    const [workflowRows] = await pool.query(
      "SELECT workflows.*, projects.name AS project_name FROM workflows LEFT JOIN projects ON workflows.project_id = projects.id",
    );

    if (workflowRows.length === 0) {
      return sendSuccess(res, "No workflows found");
    }

    return sendSuccess(res, "All Workflows retrived", {
      workflows: workflowRows,
    });
  } catch (error) {
    next(error);
  }
}

async function getWorkflowById(req, res, next) {
  try {
    const { id } = req.params;

    const [workflowRows] = await pool.query(
      "SELECT workflows.*, projects.name AS project_name FROM workflows LEFT JOIN projects ON workflows.project_id = projects.id WHERE workflows.id = ?",
      [id],
    );

    if (workflowRows.length === 0) {
      return sendError(res, "Workflow not found", 404);
    }

    return sendSuccess(res, "Workflow retrived", {
      workflow: workflowRows[0],
    });
  } catch (error) {
    next(error);
  }
}

async function updateWorkflow(req, res, next) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const [workflowRows] = await pool.query(
      "SELECT * FROM workflows WHERE id = ?",
      [id],
    );

    if (workflowRows.length === 0) {
      return sendError(res, "Workflow not found", 404);
    }

    const workflow = workflowRows[0];

    if (
      req.user.role === "manager" &&
      workflow.created_by !== req.user.userId
    ) {
      return sendError(res, "Access denied", 403);
    }

    const { name, is_active, action_type } = req.body;
    const updatedName = name ?? workflow.name;
    const updatedIsActive = is_active ?? workflow.is_active;
    const updatedActionType = action_type ?? workflow.action_type;

    await pool.query(
      "UPDATE workflows SET name = ?, is_active = ?, action_type = ? WHERE id = ?",
      [updatedName, updatedIsActive, updatedActionType, id],
    );

    return sendSuccess(res, "Workflow updated successfully");
  } catch (error) {
    next(error);
  }
}

async function deleteWorkflow(req, res, next) {
  try {
    const { id } = req.params;

    const [workflowRows] = await pool.query(
      "SELECT * FROM workflows WHERE id = ?",
      [id],
    );

    if (workflowRows.length === 0) {
      return sendError(res, "Workflow not found", 404);
    }

    const workflow = workflowRows[0];

    if (
      req.user.role === "manager" &&
      workflow.created_by !== req.user.userId
    ) {
      return sendError(res, "Access denied", 403);
    }

    await pool.query("DELETE FROM workflows WHERE id = ?", [id]);

    return sendSuccess(res, "Workflow deleted successfully");
  } catch (error) {
    next(error);
  }
}

export {
  createWorkflow,
  getAllWorkflows,
  getWorkflowById,
  updateWorkflow,
  deleteWorkflow,
};
