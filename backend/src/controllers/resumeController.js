import axios from "axios";
import FormData from "form-data";
import { ENV } from "../lib/env.js";
import { Resume } from "../models/Resume.js";


const AI_ANALYZER_URL = `${ENV.AI_BACKEND_URL}/api/resume/analyze`;


export const analyzeResume = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume PDF is required." });
    }

    const { job_role, job_description = "" } = req.body;
    if (!job_role || !job_role.trim()) {
      return res.status(400).json({ message: "job_role is required." });
    }

    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname || "resume.pdf",
      contentType: req.file.mimetype || "application/pdf",
    });
    formData.append("job_role", job_role.trim());
    formData.append("job_description", job_description);

    const { data } = await axios.post(AI_ANALYZER_URL, formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 120000,
    });

    const resume = await Resume.create({
      userId,
      jobRole: job_role.trim(),
      jobDescription: job_description,
      cloudinaryUrl: data.cloudinary_url,
      atsScore: data.ats_score,
      matchedKeywords: data.matched_keywords || [],
      missingKeywords: data.missing_keywords || [],
      sectionFeedback: {
        summary: data.section_feedback?.summary || "",
        experience: data.section_feedback?.experience || "",
        skills: data.section_feedback?.skills || "",
        education: data.section_feedback?.education || "",
        projects: data.section_feedback?.projects || "",
      },
      overallSuggestions: data.overall_suggestions || [],
      strengths: data.strengths || [],
    });

    return res.status(201).json(resume);
  } catch (error) {
    console.error("Error analyzing resume:", error.response?.data || error.message);

    if (error.response) {
      return res.status(error.response.status || 500).json({
        message:
          error.response.data?.detail ||
          error.response.data?.message ||
          "AI backend failed to process resume.",
      });
    }

    return res.status(500).json({ message: "Failed to analyze resume." });
  }
};


export const getUserResumes = async (req, res) => {
  try {
    const userId = req.user?._id;
    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(resumes);
  } catch (error) {
    console.error("Error fetching user resumes:", error.message);
    return res.status(500).json({ message: "Failed to fetch resumes." });
  }
};


export const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found." });
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json(resume);
  } catch (error) {
    console.error("Error fetching resume by id:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid resume id." });
    }

    return res.status(500).json({ message: "Failed to fetch resume." });
  }
};
