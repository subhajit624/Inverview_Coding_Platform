import axios from "axios";
import mongoose from "mongoose";
import { ENV } from "../lib/env.js";
import { AiInterview } from "../models/AiInterview.js";

const AI_INTERVIEW_URL = `${ENV.AI_BACKEND_URL}/interview`;
const VALID_LEVELS = new Set(["junior", "mid", "senior"]);

const clampScore = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(10, numeric));
};

const handleFastApiError = (res, error, fallbackMessage) => {
  console.error("AI interview error:", error.response?.data || error.message);

  if (error.response) {
    return res.status(error.response.status || 500).json({
      message:
        error.response.data?.detail ||
        error.response.data?.message ||
        fallbackMessage,
    });
  }

  return res.status(500).json({ message: fallbackMessage });
};

export const startInterview = async (req, res) => {
  try {
    const { userId, role, level = "mid" } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    if (!role || !role.trim()) {
      return res.status(400).json({ message: "role is required." });
    }

    const normalizedLevel = String(level).toLowerCase();
    if (!VALID_LEVELS.has(normalizedLevel)) {
      return res
        .status(400)
        .json({ message: "level must be junior, mid, or senior." });
    }

    const matchesCurrentUser =
      String(userId) === String(req.user._id) || String(userId) === req.user.clerkId;

    if (!matchesCurrentUser) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { data } = await axios.post(`${AI_INTERVIEW_URL}/start`, {
      role: role.trim(),
      level: normalizedLevel,
    });

    const firstQuestion = String(data?.question || "").trim();
    if (!firstQuestion) {
      return res
        .status(502)
        .json({ message: "AI backend did not return a valid first question." });
    }

    const interview = await AiInterview.create({
      user: req.user._id,
      role: role.trim(),
      level: normalizedLevel,
      conversation: [{ role: "ai", content: firstQuestion }],
    });

    return res.status(201).json({
      interviewId: interview._id,
      question: firstQuestion,
    });
  } catch (error) {
    return handleFastApiError(error.response ? res : res, error, "Failed to start interview.");
  }
};

export const respondInterview = async (req, res) => {
  try {
    const { interviewId, userAnswer } = req.body;

    if (!interviewId || !mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({ message: "A valid interviewId is required." });
    }

    if (!userAnswer || !userAnswer.trim()) {
      return res.status(400).json({ message: "userAnswer is required." });
    }

    const interview = await AiInterview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    if (String(interview.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (interview.status === "completed") {
      return res.status(400).json({ message: "Interview is already completed." });
    }

    const conversationForContext = [
      ...interview.conversation.map((item) => ({
        role: item.role,
        content: item.content,
      })),
      { role: "user", content: userAnswer.trim() },
    ];

    const { data } = await axios.post(`${AI_INTERVIEW_URL}/respond`, {
      role: interview.role,
      level: interview.level,
      conversation: conversationForContext,
    });

    const score = clampScore(data?.score);
    const feedback = String(data?.feedback || "No feedback provided.").trim();
    const userAnswerCount = conversationForContext.filter(
      (item) => item.role === "user"
    ).length;
    const isLast = Boolean(data?.isLast) || userAnswerCount >= 8;
    const nextQuestion = String(data?.nextQuestion || "").trim();

    interview.conversation.push({
      role: "user",
      content: userAnswer.trim(),
      score,
      feedback,
    });

    if (!isLast) {
      interview.conversation.push({
        role: "ai",
        content: nextQuestion || "Can you walk me through another relevant example?",
      });
    }

    await interview.save();

    return res.status(200).json({
      score,
      feedback,
      nextQuestion: !isLast
        ? nextQuestion || "Can you walk me through another relevant example?"
        : "",
      isLast,
    });
  } catch (error) {
    return handleFastApiError(res, error, "Failed to process interview response.");
  }
};

export const endInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    if (!interviewId || !mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({ message: "A valid interviewId is required." });
    }

    const interview = await AiInterview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    if (String(interview.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (interview.status === "completed") {
      return res.status(200).json(interview);
    }

    const conversationForContext = interview.conversation.map((item) => ({
      role: item.role,
      content: item.content,
    }));

    const { data } = await axios.post(`${AI_INTERVIEW_URL}/end`, {
      conversation: conversationForContext,
    });

    interview.status = "completed";
    interview.overallFeedback = String(data?.overallFeedback || "").trim();
    interview.overallScore = clampScore(data?.overallScore);

    const updatedInterview = await interview.save();

    return res.status(200).json(updatedInterview);
  } catch (error) {
    return handleFastApiError(res, error, "Failed to end interview.");
  }
};

export const getInterviewHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    const matchesCurrentUser =
      String(userId) === String(req.user._id) || String(userId) === req.user.clerkId;

    if (!matchesCurrentUser) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const interviews = await AiInterview.find({
      user: req.user._id,
      status: "completed",
    }).sort({ createdAt: -1 });

    return res.status(200).json(interviews);
  } catch (error) {
    console.error("Error fetching AI interview history:", error.message);
    return res.status(500).json({ message: "Failed to fetch interview history." });
  }
};
