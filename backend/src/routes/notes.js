import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import mongoose from "mongoose";

import { ENV } from "../lib/env.js";
import { NoteMeta } from "../models/NoteMeta.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isPdf =
      file.mimetype === "application/pdf" ||
      file.originalname?.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return cb(new Error("Only PDF files are allowed."));
    }

    return cb(null, true);
  },
});

const handlePdfUpload = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "PDF size must be under 10MB." });
    }

    return res
      .status(400)
      .json({ message: error.message || "Invalid PDF upload." });
  });
};

router.post("/upload", handlePdfUpload, async (req, res) => {
  let note = null;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required." });
    }

    const userId = String(req.body?.userId || "").trim();
    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    note = await NoteMeta.create({
      userId,
      fileName: req.file.originalname || "notes.pdf",
      uploadedAt: new Date(),
      messages: [],
    });

    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname || "notes.pdf",
      contentType: req.file.mimetype || "application/pdf",
    });
    formData.append("userId", userId);
    formData.append("noteId", note._id.toString());

    await axios.post(`${ENV.AI_BACKEND_URL}/upload-notes`, formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 120000,
    });

    return res.status(201).json({
      success: true,
      noteId: note._id,
    });
  } catch (error) {
    console.error("Error in /api/notes/upload:", error.response?.data || error.message);

    if (note?._id) {
      await NoteMeta.findByIdAndDelete(note._id).catch(() => null);
    }

    if (error.response) {
      return res.status(error.response.status || 500).json({
        message:
          error.response.data?.detail ||
          error.response.data?.message ||
          "AI backend failed to process notes.",
      });
    }

    return res.status(500).json({ message: "Failed to upload notes." });
  }
});

router.post("/ask", async (req, res) => {
  try {
    const question = String(req.body?.question || "").trim();
    const noteId = String(req.body?.noteId || "").trim();
    const userId = String(req.body?.userId || "").trim();

    if (!question || !noteId || !userId) {
      return res
        .status(400)
        .json({ message: "question, noteId and userId are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: "Invalid noteId." });
    }

    const note = await NoteMeta.findOne({ _id: noteId, userId });
    if (!note) {
      return res.status(404).json({ message: "Note not found for this user." });
    }

    const { data } = await axios.post(
      `${ENV.AI_BACKEND_URL}/ask-notes`,
      { question, userId, noteId },
      { timeout: 120000 }
    );

    const answer = String(data?.answer || "No answer generated.").trim();

    note.messages.push({
      role: "user",
      content: question,
      createdAt: new Date(),
    });
    note.messages.push({
      role: "assistant",
      content: answer,
      createdAt: new Date(),
    });
    await note.save();

    return res.status(200).json({
      answer,
      messages: note.messages,
    });
  } catch (error) {
    console.error("Error in /api/notes/ask:", error.response?.data || error.message);

    if (error.response) {
      return res.status(error.response.status || 500).json({
        message:
          error.response.data?.detail ||
          error.response.data?.message ||
          "AI backend failed to answer question.",
      });
    }

    return res.status(500).json({ message: "Failed to ask notes." });
  }
});

router.get("/history", async (req, res) => {
  try {
    const userId = String(req.query?.userId || "").trim();
    if (!userId) {
      return res.status(400).json({ message: "userId query parameter is required." });
    }

    const notes = await NoteMeta.find({ userId }).sort({ uploadedAt: -1 });

    const mapped = notes.map((note) => ({
      _id: note._id,
      userId: note.userId,
      fileName: note.fileName,
      uploadedAt: note.uploadedAt,
      messageCount: note.messages?.length || 0,
    }));

    return res.status(200).json(mapped);
  } catch (error) {
    console.error("Error in /api/notes/history:", error.message);
    return res.status(500).json({ message: "Failed to fetch notes history." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const noteId = String(req.params?.id || "").trim();
    const userId = String(req.query?.userId || "").trim();

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: "Invalid note id." });
    }

    if (!userId) {
      return res.status(400).json({ message: "userId query parameter is required." });
    }

    const note = await NoteMeta.findOne({ _id: noteId, userId });
    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    return res.status(200).json(note);
  } catch (error) {
    console.error("Error in /api/notes/:id:", error.message);
    return res.status(500).json({ message: "Failed to fetch note." });
  }
});

export default router;