import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import env from "../config/env.js";
import pool from "../config/db.js";

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
      return res.status(409).json({ message: "Email already exists" });
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

    return res.status(201).json({
      status: "success",
      message: `User created with Id ${newUserId}`,
      userId: newUserId,
    });
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
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // get user details
    const user = rows[0];

    // check if password is correct
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // JWT genration
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn },
    );

    return res.status(200).json({
      status: "success",
      message: `Login successful, Welcome back ${user.name}`,
      token: token,
    });
  } catch (error) {
    next(error);
  }
}

export { register, login };
