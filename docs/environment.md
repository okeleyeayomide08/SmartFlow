# Environment Variables Guide

This document describes the environment variables required to run the SmartFlow API. Create a `.env` file in the root directory of your project and populate it with these variables.

---

## Variable Descriptions

| Variable                | Description                                                     |
| :---------------------- | :-------------------------------------------------------------- |
| **PORT**                | The port your server runs on. Default is `3000`.                |
| **DB_HOST**             | Your MySQL host. Usually `localhost` for local development.     |
| **DB_USER**             | Your MySQL username. Usually `root` for local development.      |
| **DB_PASSWORD**         | Your MySQL password.                                            |
| **DB_NAME**             | The database name. Must be `smartflow_db`.                      |
| **DB_PORT**             | MySQL port. Default is `3306`.                                  |
| **JWT_SECRET**          | A long random string used to sign JWT tokens. Keep this secret. |
| **JWT_EXPIRES_IN**      | How long a token stays valid. Example: `2h`, `7d`, `15m`.       |
| **RESEND_API_KEY**      | Your API key from resend.com.                                   |
| **RESEND_SENDER_EMAIL** | The email address emails are sent from.                         |
| **RESEND_SENDER_NAME**  | The name that appears in the "from" field of emails.            |

---

## ⚠️ Important Security Notes

- **Never commit your `.env` file to GitHub.**
- The `.env` file is listed in `.gitignore` by default.
- **Never share your `JWT_SECRET` or `RESEND_API_KEY`** in public channels.
- Use a long, secure, and random string for your `JWT_SECRET`.
