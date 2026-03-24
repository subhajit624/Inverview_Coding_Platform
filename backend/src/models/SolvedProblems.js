import mongoose from "mongoose";

const solvedProblemsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  problems: [
    {
      problemId: {
        type: String,
        required: true
      },
      solvedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });


export const SolvedProblems = mongoose.model( "SolvedProblems",solvedProblemsSchema);