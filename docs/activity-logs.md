# Activity Logs API

Activity logs are a read-only audit trail of everything that happens in the system. They are written automatically by the automation engine and cannot be created, updated, or deleted manually. This ensures a tamper-proof history of all system events for accountability and transparency.

**Base URL:** `/api/logs`  
**Authentication:** All endpoints require a valid JWT token in the Authorization header.

```http
Authorization: Bearer your_token_here
```

---

## Get All Logs

Returns all activity logs with the name of the user who performed the action. Results are ordered by newest first.

- **Method:** `GET`
- **URL:** `/api/logs`
- **Access:** Admin, Manager

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Retrieved all activity logs",
  "data": {
    "logs": [
      {
        "id": 1,
        "user_id": 2,
        "action": "workflow_triggered",
        "entity_type": "workflow",
        "entity_id": 1,
        "details": "Workflow \"Notify Manager On Task Complete\" was triggered by event \"task_status_changed\"",
        "created_at": "2025-01-01T00:00:00.000Z",
        "performed_by": "Manager User"
      }
    ]
  }
}
```

### Error Responses

| Status  | Message           |
| :------ | :---------------- |
| **401** | No token provided |
| **403** | Access denied     |

---

## Get Log By ID

Returns a single activity log entry with the name of the user who performed the action.

- **Method:** `GET`
- **URL:** `/api/logs/:id`
- **Access:** Admin, Manager

### URL Parameters

| Parameter | Type    | Description             |
| :-------- | :------ | :---------------------- |
| **id**    | integer | The ID of the log entry |

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Log retrieved",
  "data": {
    "log": {
      "id": 1,
      "user_id": 2,
      "action": "workflow_triggered",
      "entity_type": "workflow",
      "entity_id": 1,
      "details": "Workflow \"Notify Manager On Task Complete\" was triggered by event \"task_status_changed\"",
      "created_at": "2025-01-01T00:00:00.000Z",
      "performed_by": "Manager User"
    }
  }
}
```

### Error Responses

| Status  | Message           |
| :------ | :---------------- |
| **401** | No token provided |
| **403** | Access denied     |
| **404** | Log not found     |

---

## What Gets Logged

| Action               | Description                                             |
| :------------------- | :------------------------------------------------------ |
| `workflow_triggered` | A workflow condition was met and an action was executed |

_Activity logging will expand as more events are added to the system in future versions._
