import express from "express";
import {
  startInterview,
  respondInterview,
  endInterview,
  getInterviewHistory,
} from "../controllers/aiInterviewController.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.post("/start", protectedRoute, startInterview);
router.post("/respond", protectedRoute, respondInterview);
router.post("/end", protectedRoute, endInterview);
router.get("/history/:userId", protectedRoute, getInterviewHistory);

export default router;
