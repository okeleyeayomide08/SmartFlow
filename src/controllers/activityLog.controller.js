import pool from "../config/db.js";
import { sendSuccess, sendError } from "../helpers/response.helper.js";

async function getAllLogs(req, res, next) {
  try {
    const [activityLogRows] = await pool.query(
      "SELECT activity_logs.*, users.name AS performed_by FROM activity_logs LEFT JOIN users ON activity_logs.user_id = users.id ORDER BY activity_logs.created_at DESC",
    );

    if (activityLogRows.length === 0) {
      return sendSuccess(res, "No activity logs found");
    }

    return sendSuccess(res, "Retrieved all activity logs", {
      logs: activityLogRows,
    });
  } catch (error) {
    next(error);
  }
}

async function getLogById(req, res, next) {
  try {
    const { id } = req.params;

    const [activityLogRows] = await pool.query(
      "SELECT activity_logs.*, users.name AS performed_by FROM activity_logs LEFT JOIN users ON activity_logs.user_id = users.id WHERE activity_logs.id = ?",
      [id],
    );

    if (activityLogRows.length === 0) {
      return sendError(res, "Log not found", 404);
    }

    return sendSuccess(res, "Log retrieved", { log: activityLogRows[0] });
  } catch (error) {
    next(error);
  }
}

export { getAllLogs, getLogById };
