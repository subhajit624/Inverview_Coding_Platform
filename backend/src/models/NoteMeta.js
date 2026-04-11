import mongoose from "mongoose";

const noteMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const noteMetaSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    messages: {
      type: [noteMessageSchema],
      default: [],
    },
  },
  {
    collection: "notes_meta",
    timestamps: false,
  }
);

export const NoteMeta = mongoose.model("NoteMeta", noteMetaSchema);