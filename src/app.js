import express from "express";

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to SmartFlow API",
  });
});

export default app;
