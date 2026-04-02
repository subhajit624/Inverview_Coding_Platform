import express from "express";
import multer from "multer";

import {
  analyzeResume,
  getResumeById,
  getUserResumes,
} from "../controllers/resumeController.js";
import { protectedRoute } from "../middleware/protectedRoute.js";


const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
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

const handleResumeUpload = (req, res, next) => {
  upload.single("resume")(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Resume file must be under 5MB." });
    }

    return res.status(400).json({ message: error.message || "Invalid resume upload." });
  });
};

router.post("/analyze", protectedRoute, handleResumeUpload, analyzeResume);
router.get("/", protectedRoute, getUserResumes);
router.get("/:id", protectedRoute, getResumeById);

export default router;
