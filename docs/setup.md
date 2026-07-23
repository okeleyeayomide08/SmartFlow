# Setup Guide

Follow these steps to run SmartFlow on your local machine.

---

## Prerequisites

Make sure you have these installed before starting:

- Node.js (version 18 or higher)
- MySQL (version 8 or higher)
- MySQL Workbench
- Git

---

## Step 1 — Clone The Repository

```bash
git clone https://github.com/okeleyeayomide08/SmartFlow
cd smartflow
```

---

## Step 2 — Install Dependencies

```bash
npm install
```

---

## Step 3 — Set Up The Database

1. Open **MySQL Workbench**
2. Connect to your local MySQL server
3. Open the file located at `database/smartflow_db.sql`
4. Run the entire file by clicking the lightning bolt icon
5. This will create the `smartflow_db` database with all tables and relationships automatically

---

## Step 4 — Configure Environment Variables

1. Rename the .env_copy to `.env` file in the root of the project
2. Fill in your own values

---

## Step 5 — Set Up Resend Email Service

1. Go to **resend.com** and create a free account
2. Navigate to **API Keys** and create a new key
3. Copy the key and add it to your `.env` file as `RESEND_API_KEY`
4. Add your verified sender email as `RESEND_SENDER_EMAIL`

---

## Step 6 — Run The Project

For development with auto-restart:

```bash
npm run dev
```

For production:

```bash
npm start
```

---

## Step 7 — Test The API

The server runs on `http://localhost:3000` by default. Send a `GET` request to `http://localhost:3000/` to confirm the server is running.

You should receive:

```json
{
  "success": true,
  "message": "Welcome to SmartFlow API"
}
```

Use Postman or any API client to interact with all endpoints. Full endpoint documentation is available in the docs folder.
