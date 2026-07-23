# Database Schema

SmartFlow uses MySQL as its relational database. The schema consists of 7 tables with clearly defined relationships.

---

## Tables Overview

| Table           | Purpose                                        |
| :-------------- | :--------------------------------------------- |
| `users`         | Stores all system users                        |
| `teams`         | Groups of users that own projects              |
| `projects`      | Work containers belonging to teams             |
| `tasks`         | Individual work items inside projects          |
| `workflows`     | Automation rules defined by managers           |
| `notifications` | In-app alerts created by the automation engine |
| `activity_logs` | Complete audit trail of system events          |

---

## Relationships

- **teams**
  - └── `users` (_team_id_ → `teams.id`)
  - └── `projects` (_team_id_ → `teams.id`)
    - ├── `tasks` (_project_id_ → `projects.id`)
    - │ ├── _assigned_to_ → `users.id`
    - │ └── _created_by_ → `users.id`
    - └── `workflows` (_project_id_ → `projects.id`)
      └── _created_by_ → `users.id`
- **users**
  - ├── `notifications` (_user_id_ → `users.id`)
  - └── `activity_logs` (_user_id_ → `users.id`)

---

## Table Details

### users

| Column         | Type                           | Description              |
| :------------- | :----------------------------- | :----------------------- |
| **id**         | INT PK AUTO_INCREMENT          | Unique user ID           |
| **name**       | VARCHAR(100) NOT NULL          | Full name                |
| **email**      | VARCHAR(150) UNIQUE NOT NULL   | Login email              |
| **password**   | VARCHAR(255) NOT NULL          | Hashed password          |
| **role**       | ENUM(admin, manager, employee) | User role                |
| **team_id**    | INT FK                         | Team the user belongs to |
| **created_at** | TIMESTAMP                      | Creation timestamp       |

### teams

| Column          | Type                         | Description          |
| :-------------- | :--------------------------- | :------------------- |
| **id**          | INT PK AUTO_INCREMENT        | Unique team ID       |
| **name**        | VARCHAR(100) UNIQUE NOT NULL | Team name            |
| **description** | TEXT                         | Optional description |
| **created_at**  | TIMESTAMP                    | Creation timestamp   |

### projects

| Column          | Type                             | Description            |
| :-------------- | :------------------------------- | :--------------------- |
| **id**          | INT PK AUTO_INCREMENT            | Unique project ID      |
| **name**        | VARCHAR(150) NOT NULL            | Project name           |
| **description** | TEXT                             | Optional description   |
| **status**      | ENUM(active, completed, on_hold) | Current status         |
| **deadline**    | DATE                             | Project deadline       |
| **team_id**     | INT FK                           | Owning team            |
| **created_by**  | INT FK                           | Manager who created it |
| **created_at**  | TIMESTAMP                        | Creation timestamp     |

### tasks

| Column          | Type                                  | Description            |
| :-------------- | :------------------------------------ | :--------------------- |
| **id**          | INT PK AUTO_INCREMENT                 | Unique task ID         |
| **name**        | VARCHAR(200) NOT NULL                 | Task name              |
| **description** | TEXT                                  | Optional description   |
| **status**      | ENUM(pending, in_progress, completed) | Current status         |
| **priority**    | ENUM(low, medium, high)               | Priority level         |
| **deadline**    | DATE                                  | Task deadline          |
| **project_id**  | INT FK                                | Parent project         |
| **assigned_to** | INT FK                                | Assigned employee      |
| **created_by**  | INT FK                                | Manager who created it |
| **created_at**  | TIMESTAMP                             | Creation timestamp     |

### workflows

| Column                 | Type                  | Description                |
| :--------------------- | :-------------------- | :------------------------- |
| **id**                 | INT PK AUTO_INCREMENT | Unique workflow ID         |
| **name**               | VARCHAR(150) NOT NULL | Workflow name              |
| **project_id**         | INT FK                | Associated project         |
| **trigger_event**      | VARCHAR(100)          | Event that starts it       |
| **condition_field**    | VARCHAR(100)          | Field to evaluate          |
| **condition_operator** | VARCHAR(50)           | How to compare             |
| **condition_value**    | VARCHAR(100)          | Value to compare against   |
| **action_type**        | VARCHAR(100)          | Action to execute          |
| **is_active**          | BOOLEAN               | Whether workflow is active |
| **created_by**         | INT FK                | Manager who created it     |
| **created_at**         | TIMESTAMP             | Creation timestamp         |

### notifications

| Column         | Type                  | Description            |
| :------------- | :-------------------- | :--------------------- |
| **id**         | INT PK AUTO_INCREMENT | Unique notification ID |
| **user_id**    | INT FK                | Recipient user         |
| **title**      | VARCHAR(200)          | Short title            |
| **message**    | TEXT                  | Full message           |
| **is_read**    | BOOLEAN               | Read status            |
| **created_at** | TIMESTAMP             | Creation timestamp     |

### activity_logs

| Column          | Type                  | Description               |
| :-------------- | :-------------------- | :------------------------ |
| **id**          | INT PK AUTO_INCREMENT | Unique log ID             |
| **user_id**     | INT FK                | User who performed action |
| **action**      | VARCHAR(200)          | What happened             |
| **entity_type** | VARCHAR(100)          | Type of entity affected   |
| **entity_id**   | INT                   | ID of entity affected     |
| **details**     | TEXT                  | Extra information         |
| **created_at**  | TIMESTAMP             | When it happened          |

---

## Database Setup

To set up the database run the SQL file located at:
`database/smartflow_db.sql`

This file will create the database, all tables, and all
relationships automatically.
