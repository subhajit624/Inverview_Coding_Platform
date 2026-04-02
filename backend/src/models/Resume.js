import mongoose from "mongoose";

const sectionFeedbackSchema = new mongoose.Schema(
  {
    summary: { type: String, default: "" },
    experience: { type: String, default: "" },
    skills: { type: String, default: "" },
    education: { type: String, default: "" },
    projects: { type: String, default: "" },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobRole: { type: String, required: true },
    jobDescription: { type: String, default: "" },
    cloudinaryUrl: { type: String, required: true },
    atsScore: { type: Number, required: true },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    sectionFeedback: {
      type: sectionFeedbackSchema,
      default: () => ({}),
    },
    overallSuggestions: [{ type: String }],
    strengths: [{ type: String }],
  },
  { timestamps: true }
);

export const Resume = mongoose.model("Resume", resumeSchema);
