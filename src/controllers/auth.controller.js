import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import env from "../config/env.js";
import pool from "../config/db.js";
import { sendSuccess, sendError } from "../helpers/response.helper.js";
import { sendWelcomeEmail } from "../services/email.service.js";

async function register(req, res, next) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Object destructuring
    const { name, email, password, role } = req.body;

    // Check if email exists
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return sendError(res, "Email already exists", 409);
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // send data to the database
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role],
    );

    // Extract the new user ID
    const newUserId = result.insertId;

    await sendWelcomeEmail(email, name);

    return sendSuccess(
      res,
      `User created successfully`,
      { userId: newUserId },
      201,
    );
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Object destructuring
    const { email, password } = req.body;

    // find user by email or return error if not found
    const query =
      "SELECT id, name, password, role FROM users WHERE email = ? LIMIT 1";
    const [rows] = await pool.query(query, [email]);

    if (rows.length === 0) {
      return sendError(res, "Invalid credentials", 401);
    }

    // get user details
    const user = rows[0];

    // check if password is correct
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return sendError(res, "Invalid credentials", 401);
    }

    // JWT genration
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn },
    );

    return sendSuccess(res, `Login successful, Welcome back ${user.name}`, {
      token,
    });
  } catch (error) {
    next(error);
  }
}

export { register, login };
