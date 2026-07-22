import pool from "../config/db.js";
import { sendWorkflowTriggeredEmail } from "../services/email.service.js";

async function runAutomationEngine(triggerEvent, eventData) {
  try {
    const [workflowRows] = await pool.query(
      "SELECT * FROM workflows WHERE project_id = ? AND trigger_event = ? AND is_active = true",
      [eventData.projectId, triggerEvent],
    );

    if (workflowRows.length === 0) return;

    for (const workflow of workflowRows) {
      const conditionMet = evaluateCondition(workflow, eventData);
      if (!conditionMet) continue;

      await executeAction(workflow, eventData, triggerEvent);
    }
  } catch (error) {
    console.error("Automation engine error:", error.message);
  }
}

function evaluateCondition(workflow, eventData) {
  const actualValue = eventData[workflow.condition_field];

  if (workflow.condition_operator === "equals") {
    return actualValue === workflow.condition_value;
  }

  return false;
}

async function executeAction(workflow, eventData, triggerEvent) {
  try {
    if (workflow.action_type === "notify_manager") {
      const [managerRows] = await pool.query(
        "SELECT id, name, email FROM users WHERE id = ?",
        [eventData.createdBy],
      );

      const manager = managerRows[0];

      if (manager) {
        await pool.query(
          "INSERT INTO notifications (user_id, title, message) VALUES (?, ?,?)",
          [
            manager.id,
            "Task Completed",
            `Task "${eventData.taskName}" has been completed`,
          ],
        );

        await sendWorkflowTriggeredEmail(
          manager.email,
          manager.name,
          workflow.name,
          workflow.action_type,
        );
      }
    } else if (workflow.action_type === "notify_employee") {
      const [employeeRows] = await pool.query(
        "SELECT id, name, email FROM users WHERE id = ?",
        [eventData.assignedTo],
      );

      const employee = employeeRows[0];

      if (employee) {
        await pool.query(
          "INSERT INTO notifications (user_id, title, message) VALUES (?, ?,?)",
          [
            employee.id,
            "Workflow Triggered",
            `Automated action executed for task "${eventData.taskName}"`,
          ],
        );

        await sendWorkflowTriggeredEmail(
          employee.email,
          employee.name,
          workflow.name,
          workflow.action_type,
        );
      }
    }

    await pool.query(
      "INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)",
      [
        eventData.createdBy,
        "workflow_triggered",
        "workflow",
        workflow.id,
        `Workflow "${workflow.name}" was triggered by event "${triggerEvent}"`,
      ],
    );
  } catch (error) {
    console.error("Error executing workflow action:", error.message);
  }
}

export { runAutomationEngine };
