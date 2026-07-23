# Users API

User management allows admins to view, update, assign, and delete users. Employees can view and update their own profiles only.

**Base URL:** `/api/users`  
**Authentication:** All endpoints require a valid JWT token in the Authorization header.

```http
Authorization: Bearer your_token_here
```

---

## Get All Users

Returns all users in the system.

- **Method:** `GET`
- **URL:** `/api/users`
- **Access:** Admin only

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "All users retrieved successfully",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "admin",
        "team_id": null,
        "created_at": "2025-01-01T00:00:00.000Z"
      },
      {
        "id": 2,
        "name": "Manager User",
        "email": "manager@example.com",
        "role": "manager",
        "team_id": 1,
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

## Get User By ID

Returns a single user by their ID. Employees can only view their own profile.

- **Method:** `GET`
- **URL:** `/api/users/:id`
- **Access:** Admin, Manager, Employee (own profile only)

### URL Parameters

| Parameter | Type    | Description        |
| :-------- | :------ | :----------------- |
| **id**    | integer | The ID of the user |

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "User found",
  "data": {
    "user": {
      "id": 2,
      "name": "Manager User",
      "email": "manager@example.com",
      "role": "manager",
      "team_id": 1,
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
| **404** | User not found    |

---

## Update User

Updates a user's name or email. Employees can only update their own profile.

- **Method:** `PATCH`
- **URL:** `/api/users/:id`
- **Access:** Admin, Employee (own profile only)

### URL Parameters

| Parameter | Type    | Description                  |
| :-------- | :------ | :--------------------------- |
| **id**    | integer | The ID of the user to update |

### Request Body

| Field     | Type   | Required | Description             |
| :-------- | :----- | :------- | :---------------------- |
| **name**  | string | No       | New full name           |
| **email** | string | No       | New valid email address |

### Example Request

```json
{
  "name": "Manager User Updated"
}
```

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": null
}
```

### Error Responses

| Status  | Message              |
| :------ | :------------------- |
| **400** | Validation errors    |
| **401** | No token provided    |
| **403** | Access denied        |
| **404** | User not found       |
| **409** | Email already exists |

---

## Assign User To Team

Assigns a user to a specific team.

- **Method:** `PATCH`
- **URL:** `/api/users/:id/assign-team`
- **Access:** Admin only

### URL Parameters

| Parameter | Type    | Description                  |
| :-------- | :------ | :--------------------------- |
| **id**    | integer | The ID of the user to assign |

### Request Body

| Field       | Type    | Required | Description                              |
| :---------- | :------ | :------- | :--------------------------------------- |
| **team_id** | integer | Yes      | The ID of the team to assign the user to |

### Example Request

```json
{
  "team_id": 1
}
```

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "User assigned to team successfully",
  "data": null
}
```

### Error Responses

| Status  | Message           |
| :------ | :---------------- |
| **400** | Validation errors |
| **401** | No token provided |
| **403** | Access denied     |
| **404** | User not found    |
| **404** | Team not found    |

---

## Delete User

Deletes a user from the system. Cannot delete a user with assigned tasks or created projects.

- **Method:** `DELETE`
- **URL:** `/api/users/:id`
- **Access:** Admin only

### URL Parameters

| Parameter | Type    | Description                  |
| :-------- | :------ | :--------------------------- |
| **id**    | integer | The ID of the user to delete |

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null
}
```

### Error Responses

| Status  | Message                                  |
| :------ | :--------------------------------------- |
| **400** | Cannot delete user with assigned tasks   |
| **400** | Cannot delete user with created projects |
| **401** | No token provided                        |
| **403** | Access denied                            |
| **404** | User not found                           |
