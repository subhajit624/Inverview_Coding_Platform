import express from "express";
import {
  markProblemSolved,
  getSolvedProblems,
  getLeaderboard
} from "../controllers/problemController.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.post("/solve", protectedRoute, markProblemSolved);
router.get("/my", protectedRoute, getSolvedProblems);
router.get("/leaderboard", protectedRoute, getLeaderboard);

export default router;
