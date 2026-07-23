# Tasks API

Tasks are individual units of work inside a project. They are assigned to employees and tracked through status stages.

**Base URL:** `/api/tasks`  
**Authentication:** All endpoints require a valid JWT token in the Authorization header.

```http
Authorization: Bearer your_token_here
```

---

## Create Task

Creates a new task inside a project and assigns it to an employee. Automatically sends a task assigned email to the employee.

- **Method:** `POST`
- **URL:** `/api/tasks`
- **Access:** Admin, Manager

### Request Body

| Field           | Type    | Required | Description                                        |
| :-------------- | :------ | :------- | :------------------------------------------------- |
| **name**        | string  | Yes      | Name of the task                                   |
| **description** | string  | No       | Optional description                               |
| **priority**    | string  | No       | One of: `low`, `medium`, `high`. Default: `medium` |
| **deadline**    | date    | No       | Task deadline in `YYYY-MM-DD` format               |
| **project_id**  | integer | Yes      | ID of the project this task belongs to             |
| **assigned_to** | integer | Yes      | ID of the employee to assign the task to           |

### Example Request

```json
{
  "name": "Build Homepage API",
  "description": "Create all endpoints for the homepage",
  "priority": "high",
  "deadline": "2025-11-01",
  "project_id": 1,
  "assigned_to": 3
}
```

### Example Response — 201 Created

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "taskId": 1
  }
}
```

### Error Responses

| Status  | Message                                 |
| :------ | :-------------------------------------- |
| **400** | Validation errors                       |
| **400** | Tasks can only be assigned to employees |
| **401** | No token provided                       |
| **403** | Access denied                           |
| **404** | Project not found                       |
| **404** | Assigned user not found                 |

---

## Get All Tasks

Returns all tasks with assigned user name and project name.

- **Method:** `GET`
- **URL:** `/api/tasks`
- **Access:** Admin, Manager

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "All Tasks retrieved",
  "data": {
    "tasks": [
      {
        "id": 1,
        "name": "Build Homepage API",
        "description": "Create all endpoints for the homepage",
        "status": "pending",
        "priority": "high",
        "deadline": "2025-11-01",
        "project_id": 1,
        "assigned_to": 3,
        "created_by": 2,
        "created_at": "2025-01-01T00:00:00.000Z",
        "assigned_to_name": "Employee User",
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

## Get Task By ID

Returns a single task. Employees can only view tasks assigned to them.

- **Method:** `GET`
- **URL:** `/api/tasks/:id`
- **Access:** Admin, Manager, Employee (own tasks only)

### URL Parameters

| Parameter | Type    | Description        |
| :-------- | :------ | :----------------- |
| **id**    | integer | The ID of the task |

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "task": {
      "id": 1,
      "name": "Build Homepage API",
      "status": "pending",
      "priority": "high",
      "deadline": "2025-11-01",
      "assigned_to_name": "Employee User",
      "project_name": "SmartFlow Website"
    }
  }
}
```

### Error Responses

| Status  | Message           |
| :------ | :---------------- |
| **401** | No token provided |
| **403** | Access denied     |
| **404** | Task not found    |

---

## Get My Tasks

Returns all tasks assigned to the currently logged in user.

- **Method:** `GET`
- **URL:** `/api/tasks/my-tasks`
- **Access:** Admin, Manager, Employee

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Your tasks retrieved successfully",
  "data": {
    "tasks": [
      {
        "id": 1,
        "name": "Build Homepage API",
        "status": "pending",
        "priority": "high",
        "deadline": "2025-11-01",
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

---

## Update Task Status

Updates the status of a task. Employees can only update tasks assigned to them. When status is set to `completed`, the manager receives a task completed email and the automation engine evaluates active workflows.

- **Method:** `PATCH`
- **URL:** `/api/tasks/:id/status`
- **Access:** Admin, Manager, Employee (own tasks only)

### URL Parameters

| Parameter | Type    | Description        |
| :-------- | :------ | :----------------- |
| **id**    | integer | The ID of the task |

### Request Body

| Field      | Type   | Required | Description                                   |
| :--------- | :----- | :------- | :-------------------------------------------- |
| **status** | string | Yes      | One of: `pending`, `in_progress`, `completed` |

### Example Request

```json
{
  "status": "completed"
}
```

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Task status updated successfully",
  "data": null
}
```

### Error Responses

| Status  | Message           |
| :------ | :---------------- |
| **400** | Validation errors |
| **401** | No token provided |
| **403** | Access denied     |
| **404** | Task not found    |

---

## Delete Task

Deletes a task from the system. Managers can only delete tasks they created.

- **Method:** `DELETE`
- **URL:** `/api/tasks/:id`
- **Access:** Admin, Manager (own tasks only)

### URL Parameters

| Parameter | Type    | Description                  |
| :-------- | :------ | :--------------------------- |
| **id**    | integer | The ID of the task to delete |

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": null
}
```

### Error Responses

| Status  | Message           |
| :------ | :---------------- |
| **401** | No token provided |
| **403** | Access denied     |
| **404** | Task not found    |
