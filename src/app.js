import express from "express";
import authRouter from "./routes/auth.routes.js";
import teamRouter from "./routes/team.routes.js";
import userRouter from "./routes/user.routes.js";
import projectRouter from "./routes/project.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Using routers
app.use("/api/auth", authRouter);
app.use("/api/teams", teamRouter);
app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);

// Check route workinng properly
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to SmartFlow API",
  });
});

// Using Error Middleware
app.use(errorMiddleware);

export default app;
