# Teams API

Manage operational groups and organizational structure within the system.  
**Base URL:** `/api/teams`

---

## Create Team

Creates a new operational team.

- **Method:** `POST`
- **URL:** `/api/teams`
- **Access:** Admin only

### Request Body

| Field           | Type   | Required | Description             |
| :-------------- | :----- | :------- | :---------------------- |
| **name**        | string | Yes      | Unique name of the team |
| **description** | string | No       | Optional description    |

### Example Request

```json
{
  "name": "Backend Squad",
  "description": "Handles all backend and API work"
}
```

### Example Response — 201 Created

```json
{
  "success": true,
  "message": "Team Created Successfully",
  "data": {
    "teamId": 1,
    "teamName": "Backend Squad"
  }
}
```

### Error Responses

| Status  | Message                  |
| :------ | :----------------------- |
| **400** | Validation errors        |
| **401** | No token provided        |
| **403** | Access denied            |
| **409** | Team name already exists |

---

## Get All Teams

Returns a list of all teams in the system.

- **Method:** `GET`
- **URL:** `/api/teams`
- **Access:** Admin, Manager

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "All teams retrieved successfully",
  "data": {
    "teams": [
      {
        "id": 1,
        "name": "Backend Squad",
        "description": "Handles all backend and API work",
        "created_at": "2025-01-01T00:00:00.000Z"
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

## Get Team By ID

Returns detailed profiles for a single team.

- **Method:** `GET`
- **URL:** `/api/teams/:id`
- **Access:** Admin, Manager

### URL Parameters

| Parameter | Type    | Description        |
| :-------- | :------ | :----------------- |
| **id**    | integer | The ID of the team |

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Retrieved team with id 1",
  "data": {
    "team": {
      "id": 1,
      "name": "Backend Squad",
      "description": "Handles all backend and API work",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

### Error Responses

| Status  | Message           |
| :------ | :---------------- |
| **401** | No token provided |
| **403** | Access denied     |
| **404** | Team not found    |

---

## Update Team

Modifies properties of an existing team.

- **Method:** `PATCH`
- **URL:** `/api/teams/:id`
- **Access:** Admin only

### URL Parameters

| Parameter | Type    | Description                  |
| :-------- | :------ | :--------------------------- |
| **id**    | integer | The ID of the team to update |

### Request Body

| Field           | Type   | Required | Description     |
| :-------------- | :----- | :------- | :-------------- |
| **name**        | string | No       | New team name   |
| **description** | string | No       | New description |

### Example Request

```json
{
  "description": "Handles all backend, API and database work"
}
```

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Team updated successfully",
  "data": null
}
```

### Error Responses

| Status  | Message                  |
| :------ | :----------------------- |
| **400** | Validation errors        |
| **401** | No token provided        |
| **403** | Access denied            |
| **404** | Team not found           |
| **409** | Team name already exists |

---

## Delete Team

Removes a team profile cleanly from the application.

- **Method:** `DELETE`
- **URL:** `/api/teams/:id`
- **Access:** Admin only

### URL Parameters

| Parameter | Type    | Description                  |
| :-------- | :------ | :--------------------------- |
| **id**    | integer | The ID of the team to delete |

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Team deleted successfully",
  "data": null
}
```

### Error Responses

| Status  | Message           |
| :------ | :---------------- |
| **401** | No token provided |
| **403** | Access denied     |
| **404** | Team not found    |
