import express from "express";
import authRouter from "./routes/auth.routes.js";

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Using routers
app.use("/api/auth", authRouter);

// Check route workinng properly
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to SmartFlow API",
  });
});

export default app;
