# SmartFlow — Backend Workflow Automation Engine

SmartFlow is a backend RESTful API system that helps small teams
manage their projects, assign tasks, and automate repetitive
workflows through an intelligent event-driven automation engine.

Built with Node.js, Express, MySQL, and integrated with Resend
for real-time email notifications.

---

## What Makes SmartFlow Different

Most project management backends are simple CRUD systems.
SmartFlow goes further by introducing a Workflow Automation
Engine — a system that listens for events, evaluates conditions,
and executes actions automatically without any human intervention.

For example:

When an employee marks a task as completed, SmartFlow
automatically notifies the manager through an in-app
notification and a real email — without the manager having
to check anything manually.

---

## Tech Stack

| Technology        | Purpose                          |
| ----------------- | -------------------------------- |
| Node.js           | Runtime environment              |
| Express.js        | REST API framework               |
| MySQL             | Relational database              |
| mysql2            | MySQL driver for Node.js         |
| JSON Web Tokens   | Authentication and authorization |
| bcryptjs          | Password hashing                 |
| express-validator | Input validation                 |
| Resend            | External email delivery service  |
| dotenv            | Environment variable management  |
| nodemon           | Development auto-restart         |

---

## Project Structure

```text
smartflow/
│
├── src/
│   ├── config/       → Database and environment configuration
│   ├── controllers/  → Business logic for each feature
│   ├── middlewares/  → Authentication, roles, error handling
│   ├── routes/       → API route definitions
│   ├── validators/   → Input validation rules
│   ├── services/     → External services (email)
│   ├── engine/       → Workflow automation engine
│   ├── helpers/      → Reusable utility functions
│   └── app.js        → Express app configuration
│
├── docs/             → Detailed API documentation
├── database/         → SQL schema export
├── .env              → Environment variables (not included but .env_copy included rename it to .env)
├── server.js         → Server entry point
└── README.md         → Project overview
```

---

## Documentation

| Document                                       | Description                        |
| ---------------------------------------------- | ---------------------------------- |
| [Setup Guide](docs/setup.md)                   | How to install and run the project |
| [Environment Variables](docs/environment.md)   | All required environment variables |
| [Database Schema](docs/database.md)            | Database design and relationships  |
| [Authentication](docs/authentication.md)       | Register and login endpoints       |
| [Teams](docs/teams.md)                         | Team management endpoints          |
| [Users](docs/users.md)                         | User management endpoints          |
| [Projects](docs/projects.md)                   | Project management endpoints       |
| [Tasks](docs/tasks.md)                         | Task management endpoints          |
| [Workflows](docs/workflows.md)                 | Workflow management endpoints      |
| [Notifications](docs/notifications.md)         | Notification endpoints             |
| [Activity Logs](docs/activity-logs.md)         | Activity log endpoints             |
| [Automation Engine](docs/automation-engine.md) | How the engine works               |

---

## Quick Start

See the [Setup Guide](docs/setup.md) to get the project
running on your local machine.

---

## Author

Name: Okeleye Ayomide and Okeleye Opeyemi
