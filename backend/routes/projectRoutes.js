import express from "express";

import {
  generateProjects,
  getLatestProjects,
  getProjectHistory,
  updateProjectStatus,
} from "../controllers/projectController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/generate", generateProjects);

router.get("/latest", getLatestProjects);

router.get("/history", getProjectHistory);

router.patch(
  "/:recommendationId/projects/:projectId",
  updateProjectStatus
);

export default router;