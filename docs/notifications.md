# Notifications API

Notifications are created automatically by the automation engine when a workflow action is executed. Users cannot create notifications manually. Each user can only view, read, and delete their own notifications.

**Base URL:** `/api/notifications`  
**Authentication:** All endpoints require a valid JWT token in the Authorization header.

```http
Authorization: Bearer your_token_here
```

---

## Get My Notifications

Returns all notifications for the currently logged in user. Results are ordered by newest first.

- **Method:** `GET`
- **URL:** `/api/notifications`
- **Access:** Admin, Manager, Employee

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "These are your notifications",
  "data": {
    "notifications": [
      {
        "id": 1,
        "user_id": 2,
        "title": "Task Completed",
        "message": "Task \"Build Homepage API\" has been completed",
        "is_read": false,
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

---

## Mark Notification As Read

Marks a specific notification as read. Users can only mark their own notifications as read.

- **Method:** `PATCH`
- **URL:** `/api/notifications/:id/read`
- **Access:** Admin, Manager, Employee

### URL Parameters

| Parameter | Type    | Description                |
| :-------- | :------ | :------------------------- |
| **id**    | integer | The ID of the notification |

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": null
}
```

### Error Responses

| Status  | Message                |
| :------ | :--------------------- |
| **401** | No token provided      |
| **403** | Access denied          |
| **404** | Notification not found |

---

## Delete Notification

Deletes a notification permanently. Users can only delete their own notifications.

- **Method:** `DELETE`
- **URL:** `/api/notifications/:id`
- **Access:** Admin, Manager, Employee

### URL Parameters

| Parameter | Type    | Description                          |
| :-------- | :------ | :----------------------------------- |
| **id**    | integer | The ID of the notification to delete |

### Example Response — 200 OK

```json
{
  "success": true,
  "message": "Notification deleted successfully",
  "data": null
}
```

### Error Responses

| Status  | Message                |
| :------ | :--------------------- |
| **401** | No token provided      |
| **403** | Access denied          |
| **404** | Notification not found |
