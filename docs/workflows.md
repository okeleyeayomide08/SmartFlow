# Workflows API

Workflows are automation rules that define what happens automatically when specific events occur in the system. See the [Automation Engine](automation-engine.md) document for a full explanation of how workflows are processed.

**Base URL:** `/api/workflows`  
**Authentication:** All endpoints require a valid JWT token in the Authorization header.

```http
Authorization: Bearer your_token_here
```

---

## Create Workflow

Creates a new automation workflow for a project.

- **Method:** `POST`
- **URL:** `/api/workflows`
- **Access:** Admin, Manager

### Request Body

| Field                  | Type    | Required | Description                                   |
| :--------------------- | :------ | :------- | :-------------------------------------------- |
| **name**               | string  | Yes      | Name of the workflow                          |
| **project_id**         | integer | Yes      | ID of the project this workflow belongs to    |
| **trigger_event**      | string  | Yes      | Must be: `task_status_changed`                |
| **condition_field**    | string  | Yes      | Must be: `status`                             |
| **condition_operator** | string  | Yes      | Must be: `equals`                             |
| **condition_value**    | string  | Yes      | One of: `pending`, `in_progress`, `completed` |
| **action_type**        | string  | Yes      | One of: `notify_manager`, `notify_employee`   |

### Example Request

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

### Example Response — 201 Created

```json
{
  "success": true,
  "message": "Workflow created",
  "data": {
    "workflowId": 1
  }
}
```

### Error Responses

| Status  | Message                                      |
| :------ | :------------------------------------------- |
| **400** | Validation errors                            |
| **401** | No token provided                            |
| **403** | Access denied                                |
| **404** | Project not found                            |
| **409** | Workflow name already exists in this project |

---

## Get All Workflows

Returns all workflows with their project name.

- **Method:** `GET`
- **URL:** `/api/workflows`
- **Access:** Admin, Manager

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "All Workflows retrieved",
  "data": {
    "workflows": [
      {
        "id": 1,
        "name": "Notify Manager On Task Complete",
        "project_id": 1,
        "trigger_event": "task_status_changed",
        "condition_field": "status",
        "condition_operator": "equals",
        "condition_value": "completed",
        "action_type": "notify_manager",
        "is_active": true,
        "created_by": 2,
        "created_at": "2025-01-01T00:00:00.000Z",
        "project_name": "SmartFlow Website"
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

## Get Workflow By ID

Returns a single workflow with its project name.

- **Method:** `GET`
- **URL:** `/api/workflows/:id`
- **Access:** Admin, Manager

### URL Parameters

| Parameter | Type    | Description            |
| :-------- | :------ | :--------------------- |
| **id**    | integer | The ID of the workflow |

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Workflow retrieved",
  "data": {
    "workflow": {
      "id": 1,
      "name": "Notify Manager On Task Complete",
      "project_id": 1,
      "trigger_event": "task_status_changed",
      "condition_field": "status",
      "condition_operator": "equals",
      "condition_value": "completed",
      "action_type": "notify_manager",
      "is_active": true,
      "created_by": 2,
      "created_at": "2025-01-01T00:00:00.000Z",
      "project_name": "SmartFlow Website"
    }
  }
}
```

### Error Responses

| Status  | Message            |
| :------ | :----------------- |
| **401** | No token provided  |
| **403** | Access denied      |
| **404** | Workflow not found |

---

## Update Workflow

Updates an existing workflow. Managers can only update workflows they created.

- **Method:** `PATCH`
- **URL:** `/api/workflows/:id`
- **Access:** Admin, Manager (own workflows only)

### URL Parameters

| Parameter | Type    | Description                      |
| :-------- | :------ | :------------------------------- |
| **id**    | integer | The ID of the workflow to update |

### Request Body

| Field           | Type    | Required | Description                                 |
| :-------------- | :------ | :------- | :------------------------------------------ |
| **name**        | string  | No       | New workflow name                           |
| **is_active**   | boolean | No       | Enable or disable the workflow              |
| **action_type** | string  | No       | One of: `notify_manager`, `notify_employee` |

### Example Request

```json
{
  "is_active": false
}
```

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Workflow updated successfully",
  "data": null
}
```

### Error Responses

| Status  | Message            |
| :------ | :----------------- |
| **400** | Validation errors  |
| **401** | No token provided  |
| **403** | Access denied      |
| **404** | Workflow not found |

---

## Delete Workflow

Deletes a workflow from the system. Managers can only delete workflows they created.

- **Method:** `DELETE`
- **URL:** `/api/workflows/:id`
- **Access:** Admin, Manager (own workflows only)

### URL Parameters

| Parameter | Type    | Description                      |
| :-------- | :------ | :------------------------------- |
| **id**    | integer | The ID of the workflow to delete |

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Workflow deleted successfully",
  "data": null
}
```

### Error Responses

| Status  | Message            |
| :------ | :----------------- |
| **401** | No token provided  |
| **403** | Access denied      |
| **404** | Workflow not found |
