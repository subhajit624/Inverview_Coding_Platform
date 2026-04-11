import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserButton, useUser } from "@clerk/react";
import {
  ArrowLeft,
  Code2,
  Loader2,
  NotebookPen,
  Trophy,
  UploadCloud,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

const STYLES = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes pulse-ring {
  0%,100% { box-shadow: 0 0 0 0px rgba(249,115,22,0.24); }
  50% { box-shadow: 0 0 0 10px rgba(249,115,22,0); }
}
.fade-up { animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both; }
.fade-up-1 { animation-delay: .05s; }
.fade-up-2 { animation-delay: .12s; }
.fade-up-3 { animation-delay: .2s; }
.shimmer-text {
  background: linear-gradient(90deg, #fdba74 0%, #f97316 35%, #fb7185 70%, #fdba74 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
`;

const NotesUpload = () => {
  const { user } = useUser();
  const userId = user?.id;

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noteId, setNoteId] = useState("");

  const handleFile = (nextFile) => {
    if (!nextFile) {
      return;
    }

    const lowerName = nextFile.name.toLowerCase();
    const isPdf =
      nextFile.type === "application/pdf" || lowerName.endsWith(".pdf");

    if (!isPdf) {
      toast.error("Only PDF files are allowed.");
      return;
    }

    setFile(nextFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a PDF file.");
      return;
    }

    if (!userId) {
      toast.error("User not found. Please sign in again.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/notes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data?.success && data?.noteId) {
        setNoteId(data.noteId);
        toast.success("Notes uploaded successfully.");
      } else {
        toast.error("Upload succeeded but note id is missing.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload notes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>

      <div
        className="min-h-screen text-white overflow-x-hidden"
        style={{ background: "#08080f", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
      >
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(249,115,22,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(249,115,22,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="fixed top-0 left-1/4 w-105 h-105 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="fixed bottom-0 right-1/4 w-85 h-85 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />

        <nav
          className="sticky top-0 z-50 border-b"
          style={{
            background: "rgba(8,8,15,0.88)",
            backdropFilter: "blur(24px)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div
                className="size-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #f97316, #fb7185)" }}
              >
                <Code2 className="size-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight hidden sm:block" style={{ fontFamily: "'Courier New', monospace" }}>
                Crack<span style={{ color: "#fdba74" }}>It</span>
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/dashboard"
                className="text-xs px-3 py-1.5 rounded-lg border"
                style={{ color: "rgba(255,255,255,0.55)", borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
              >
                Dashboard
              </Link>
              <Link
                to="/leaderboard"
                className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border"
                style={{ color: "rgba(255,255,255,0.55)", borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
              >
                <Trophy className="size-3.5" /> Leaderboard
              </Link>
              <UserButton />
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 relative">
          <div className="fade-up fade-up-1 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 mb-5" style={{ background: "rgba(249,115,22,0.1)", borderColor: "rgba(249,115,22,0.3)" }}>
              <div className="size-1.5 rounded-full" style={{ background: "#fdba74" }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>RAG Powered</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              <span className="shimmer-text">Upload Your Notes</span>
            </h1>
            <p className="text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.42)" }}>
              Upload a PDF, then ask questions grounded in your own material.
            </p>
          </div>

          <div className="fade-up fade-up-2 flex items-center gap-2 mb-6">
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border" style={{ color: "rgba(255,255,255,0.55)", borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
              <ArrowLeft className="size-3.5" /> Dashboard
            </Link>
            <Link to="/notes-history" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border" style={{ color: "#fdba74", borderColor: "rgba(249,115,22,0.35)", background: "rgba(249,115,22,0.1)" }}>
              <NotebookPen className="size-3.5" /> Notes History
            </Link>
          </div>

          <div className="fade-up fade-up-3 rounded-2xl border p-5 sm:p-6" style={{ background: "rgba(12,12,22,0.9)", borderColor: "rgba(249,115,22,0.2)" }}>
            <div
              className="rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center cursor-pointer transition-all"
              style={{
                background: dragOver ? "rgba(249,115,22,0.1)" : "rgba(0,0,0,0.25)",
                borderColor: dragOver ? "#f97316" : "rgba(255,255,255,0.14)",
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
            >
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border" style={{ background: "rgba(249,115,22,0.12)", borderColor: "rgba(249,115,22,0.3)", animation: dragOver ? "pulse-ring 1.5s infinite" : "none" }}>
                <UploadCloud className="size-7" style={{ color: "#fdba74" }} />
              </div>

              <p className="font-semibold text-base text-white">
                {file ? "PDF Ready" : "Drag and drop your PDF here"}
              </p>
              <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                {file ? file.name : "or click to browse"}
              </p>
              <p className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                PDF only, max 10MB
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-70"
              style={{ color: "#1d1208", background: "linear-gradient(135deg, #fdba74, #f97316)", boxShadow: "0 12px 28px rgba(249,115,22,0.28)" }}
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              {loading ? "Uploading..." : "Upload"}
            </button>

            {noteId && (
              <div className="mt-5 rounded-xl border p-4" style={{ borderColor: "rgba(52,211,153,0.35)", background: "rgba(16,185,129,0.08)" }}>
                <p className="text-sm text-green-300 mb-3">Upload complete. Your notes are indexed.</p>
                <button
                  onClick={() => navigate(`/talk-notes/${noteId}`)}
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-sm font-semibold"
                >
                  Go to Notes Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotesUpload;