# Automation Engine

The Workflow Automation Engine is the core feature that separates SmartFlow from a standard CRUD application.

---

## How It Works

The engine is triggered every time a significant event occurs in the system.

Currently, the supported event is:

- **`task_status_changed`** — fires when a task status is updated

---

## The Three Parts Of A Workflow

Every workflow consists of three distinct parts:

### 1. Trigger

The event that starts the automation.

- `trigger_event`: `"task_status_changed"`

### 2. Condition

The specific criteria that must be true for the action to execute.

- `condition_field`: `"status"`
- `condition_operator`: `"equals"`
- `condition_value`: `"completed"`

### 3. Action

What the system does automatically when the condition is met.

- `action_type`: `"notify_manager"`
- `action_type`: `"notify_employee"`

---

## The Full Automation Flow

1. Employee updates task status to `"completed"`.
2. `task.controller.js` calls: `runAutomationEngine("task_status_changed", eventData)`.
3. Engine queries the database for active workflows matching the project and trigger event.
4. For each matching workflow:
   - Evaluates the condition.
   - If condition is met → executes the action.
5. Action execution:
   - Creates an in-app notification for the target user.
   - Sends a real email via Resend.
   - Logs everything in the `activity_logs` table.

---

## Supported Trigger Events

| Event                 | Description                           |
| :-------------------- | :------------------------------------ |
| `task_status_changed` | Fires when any task status is updated |

---

## Supported Action Types

| Action            | Description                                |
| :---------------- | :----------------------------------------- |
| `notify_manager`  | Notifies the manager who created the task  |
| `notify_employee` | Notifies the employee assigned to the task |

---

## Example Workflow

This workflow notifies the manager every time a task is marked as completed in Project 1:

```json
{
  "name": "Notify Manager On Task Complete",
  "project_id": 1,
  "trigger_event": "task_status_changed",
  "condition_field": "status",
  "condition_operator": "equals",
  "condition_value": "completed",
  "action_type": "notify_manager"
}
```

When an employee marks any task in Project 1 as completed, the manager automatically receives:

- An in-app notification
- A real email via Resend

_No manual action required from anyone._
