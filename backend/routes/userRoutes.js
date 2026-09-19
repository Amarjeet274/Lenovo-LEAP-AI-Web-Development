import express from "express";

import {
  getMyProfile,
  updateMyProfile,
} from "../Controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  getMyProfile
);

router.put(
  "/me",
  authMiddleware,
  updateMyProfile
);

export default router;