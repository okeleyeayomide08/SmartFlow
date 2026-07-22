import pool from "../config/db.js";
import { sendSuccess, sendError } from "../helpers/response.helper.js";


async function getMyNotifications(req, res, next) {
  try {
    const { userId } = req.user;


    const [notificationsRows] = await pool.query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [userId],
    );


    if (notificationsRows.length === 0) {
      return sendSuccess(res, "No notifications found");
    }


    return sendSuccess(res, "These are your notifications", {
      notifications: notificationsRows,
    });
  } catch (error) {
    next(error);
  }
}


async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;
    const { userId } = req.user;


    const [notificationsRows] = await pool.query(
      "SELECT * FROM notifications WHERE id = ?",
      [id],
    );


    if (notificationsRows.length === 0) {
      return sendError(res, "Notification not found", 404);
    }


    const notification = notificationsRows[0];


    if (notification.user_id !== req.user.userId) {
      return sendError(res, "Access denied", 403);
    }


    await pool.query("UPDATE notifications SET is_read = true WHERE id = ?", [
      id,
    ]);


    return sendSuccess(res, "Notification marked as read");
  } catch (error) {
    next(error);
  }
}


async function deleteNotification(req, res, next) {
  try {
    const { id } = req.params;
    const { userId } = req.user;


    const [notificationsRows] = await pool.query(
      "SELECT * FROM notifications WHERE id = ?",
      [id],
    );


    if (notificationsRows.length === 0) {
      return sendError(res, "Notification not found", 404);
    }


    const notification = notificationsRows[0];


    if (notification.user_id !== req.user.userId) {
      return sendError(res, "Access denied", 403);
    }


    await pool.query("DELETE FROM notifications WHERE id = ?", [id]);


    return sendSuccess(res, "Notification deleted successfully");
  } catch (error) {
    next(error);
  }
}


export { getMyNotifications, markAsRead, deleteNotification };