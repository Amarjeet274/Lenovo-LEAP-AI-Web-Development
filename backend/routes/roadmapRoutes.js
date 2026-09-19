import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createRoadmap,
  getMyRoadmaps,
  getLatestRoadmap,
  updateTopicCompletion,
} from "../controllers/roadmapController.js";

const router = express.Router();

router.post(
  "/generate",
  authMiddleware,
  createRoadmap
);

router.get(
  "/",
  authMiddleware,
  getMyRoadmaps
);

router.get(
  "/latest",
  authMiddleware,
  getLatestRoadmap
);

router.patch(
  "/:roadmapId/phases/:phaseId/topics/:topicId",
  authMiddleware,
  updateTopicCompletion
);

export default router;