import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["ai", "user"], required: true },
    content: { type: String, required: true },
    score: { type: Number, min: 0, max: 10 },
    feedback: { type: String },
  },
  { timestamps: true }
);

const aiInterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: { type: String, required: true },
    level: {
      type: String,
      enum: ["junior", "mid", "senior"],
      default: "mid",
    },
    conversation: {
      type: [messageSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing",
    },
    overallFeedback: { type: String },
    overallScore: { type: Number, min: 0, max: 10 },
  },
  { timestamps: true }
);

export const AiInterview = mongoose.model("AiInterview", aiInterviewSchema);
