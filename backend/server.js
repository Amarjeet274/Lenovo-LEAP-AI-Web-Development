import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import doubtRoutes from "./routes/doubtRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

import gamificationRoutes from "./routes/gamificationRoutes.js";

dotenv.config();

await connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",

    credentials: true,
  })
);

app.use(express.json());

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message:
      "SkillPath AI backend is running successfully.",
  });
});

// API ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/roadmaps", roadmapRoutes);

app.use("/api/ai", doubtRoutes);

app.use("/api/projects", projectRoutes);
app.use("/api/progress", progressRoutes);

app.use(
  "/api/gamification",
  gamificationRoutes
);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// SERVER
app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});