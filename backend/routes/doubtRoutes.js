import express from "express";

import {
  askDoubt,
  getMyConversations,
  getConversation,
  deleteConversation,
} from "../controllers/doubtController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/doubt", askDoubt);

router.get("/conversations", getMyConversations);

router.get("/conversations/:id", getConversation);

router.delete("/conversations/:id", deleteConversation);

export default router;