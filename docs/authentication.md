# Authentication API

All authentication endpoints are public. No token required.  
**Base URL:** `/api/auth`

---

## Register

Creates a new user account.

- **Method:** `POST`
- **URL:** `/api/auth/register`

### Request Body

| Field        | Type   | Required | Description                            |
| :----------- | :----- | :------- | :------------------------------------- |
| **name**     | string | Yes      | Full name of the user                  |
| **email**    | string | Yes      | Valid email address                    |
| **password** | string | Yes      | Minimum 6 characters                   |
| **role**     | string | Yes      | One of: `admin`, `manager`, `employee` |

### Example Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "manager"
}
```

### Example Response — 201 Created

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": 1
  }
}
```

### Error Responses

| Status  | Message              |
| :------ | :------------------- |
| **400** | Validation errors    |
| **409** | Email already exists |

---

## Login

Authenticates a user and returns a JWT token.

- **Method:** `POST`
- **URL:** `/api/auth/login`

### Request Body

| Field        | Type   | Required | Description              |
| :----------- | :----- | :------- | :----------------------- |
| **email**    | string | Yes      | Registered email address |
| **password** | string | Yes      | Account password         |

### Example Request

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Login successful, Welcome back John Doe",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Responses

| Status  | Message             |
| :------ | :------------------ |
| **400** | Validation errors   |
| **401** | Invalid credentials |

---

## Using The Token

Add the token to the `Authorization` header of every protected request:

```http
Authorization: Bearer your_token_here
```

Tokens expire based on the `JWT_EXPIRES_IN` environment variable. When expired, log in again to get a new token.
