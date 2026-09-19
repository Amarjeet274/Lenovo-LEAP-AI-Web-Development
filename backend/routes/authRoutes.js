import express from "express";

import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../Controllers/authController.js";

import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", authMiddleware, getCurrentUser);

export default router;