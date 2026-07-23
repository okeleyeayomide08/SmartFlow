# Projects API

Projects are work containers that belong to teams. Tasks and workflows are created inside projects.

**Base URL:** `/api/projects`  
**Authentication:** All endpoints require a valid JWT token in the Authorization header.

```http
Authorization: Bearer your_token_here
```

---

## Create Project

Creates a new project under a team.

- **Method:** `POST`
- **URL:** `/api/projects`
- **Access:** Admin, Manager

### Request Body

| Field           | Type    | Required | Description                             |
| :-------------- | :------ | :------- | :-------------------------------------- |
| **name**        | string  | Yes      | Name of the project                     |
| **description** | string  | No       | Optional description                    |
| **team_id**     | integer | Yes      | ID of the team that owns this project   |
| **deadline**    | date    | No       | Project deadline in `YYYY-MM-DD` format |

### Example Request

```json
{
  "name": "SmartFlow Website",
  "description": "Build the company website from scratch",
  "team_id": 1,
  "deadline": "2025-12-01"
}
```

### Example Response — 201 Created

```json
{
  "success": true,
  "message": "Project Created",
  "data": {
    "projectId": 1
  }
}
```

### Error Responses

| Status  | Message                                  |
| :------ | :--------------------------------------- |
| **400** | Validation errors                        |
| **401** | No token provided                        |
| **403** | Access denied                            |
| **404** | Team not found                           |
| **409** | Project name already exists in this team |

---

## Get All Projects

Returns all projects in the system with their team name.

- **Method:** `GET`
- **URL:** `/api/projects`
- **Access:** Admin, Manager

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Retrieved all projects",
  "data": {
    "projects": [
      {
        "id": 1,
        "name": "SmartFlow Website",
        "description": "Build the company website from scratch",
        "status": "active",
        "deadline": "2025-12-01",
        "team_id": 1,
        "created_by": 2,
        "created_at": "2025-01-01T00:00:00.000Z",
        "team_name": "Backend Squad"
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

## Get Project By ID

Returns a single project with its team name.

- **Method:** `GET`
- **URL:** `/api/projects/:id`
- **Access:** Admin, Manager

### URL Parameters

| Parameter | Type    | Description           |
| :-------- | :------ | :-------------------- |
| **id**    | integer | The ID of the project |

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Retrieved Project",
  "data": {
    "project": {
      "id": 1,
      "name": "SmartFlow Website",
      "description": "Build the company website from scratch",
      "status": "active",
      "deadline": "2025-12-01",
      "team_id": 1,
      "created_by": 2,
      "created_at": "2025-01-01T00:00:00.000Z",
      "team_name": "Backend Squad"
    }
  }
}
```

### Error Responses

| Status  | Message           |
| :------ | :---------------- |
| **401** | No token provided |
| **403** | Access denied     |
| **404** | Project not found |

---

## Update Project

Updates an existing project. Managers can only update projects they created.

- **Method:** `PATCH`
- **URL:** `/api/projects/:id`
- **Access:** Admin, Manager (own projects only)

### URL Parameters

| Parameter | Type    | Description                     |
| :-------- | :------ | :------------------------------ |
| **id**    | integer | The ID of the project to update |

### Request Body

| Field           | Type   | Required | Description                              |
| :-------------- | :----- | :------- | :--------------------------------------- |
| **name**        | string | No       | New project name                         |
| **description** | string | No       | New description                          |
| **status**      | string | No       | One of: `active`, `completed`, `on_hold` |
| **deadline**    | date   | No       | New deadline in `YYYY-MM-DD` format      |

### Example Request

```json
{
  "status": "on_hold"
}
```

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": null
}
```

### Error Responses

| Status  | Message           |
| :------ | :---------------- |
| **400** | Validation errors |
| **401** | No token provided |
| **403** | Access denied     |
| **404** | Project not found |

---

## Delete Project

Deletes a project from the system. Cannot delete a project that still has tasks. Managers can only delete projects they created.

- **Method:** `DELETE`
- **URL:** `/api/projects/:id`
- **Access:** Admin, Manager (own projects only)

### URL Parameters

| Parameter | Type    | Description                     |
| :-------- | :------ | :------------------------------ |
| **id**    | integer | The ID of the project to delete |

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Project deleted successfully",
  "data": null
}
```

### Error Responses

| Status  | Message                                   |
| :------ | :---------------------------------------- |
| **400** | Cannot delete project with existing tasks |
| **401** | No token provided                         |
| **403** | Access denied                             |
| **404** | Project not found                         |
