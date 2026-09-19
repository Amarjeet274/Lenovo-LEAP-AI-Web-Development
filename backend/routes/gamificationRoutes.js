import express from "express";

import {
  getGamification,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/gamificationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getGamification);

router.patch(
  "/notifications/:id/read",
  markNotificationRead
);

router.patch(
  "/notifications/read-all",
  markAllNotificationsRead
);

export default router;