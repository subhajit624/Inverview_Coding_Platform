import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/react";
import {
  ArrowLeft,
  CalendarDays,
  Code2,
  Loader2,
  MessageSquare,
  NotebookPen,
  Plus,
  Trophy,
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
.fade-up { animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both; }
.fade-up-1 { animation-delay: .05s; }
.fade-up-2 { animation-delay: .12s; }
.shimmer-text {
  background: linear-gradient(90deg, #fdba74 0%, #f97316 35%, #fb7185 70%, #fdba74 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
`;

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Notes_History = () => {
  const { user } = useUser();
  const userId = user?.id;

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      if (!userId) {
        return;
      }

      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/notes/history", {
          params: { userId },
        });
        setNotes(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch notes history.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [userId]);

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
              <Link to="/dashboard" className="text-xs px-3 py-1.5 rounded-lg border" style={{ color: "rgba(255,255,255,0.55)", borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                Dashboard
              </Link>
              <Link to="/leaderboard" className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border" style={{ color: "rgba(255,255,255,0.55)", borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                <Trophy className="size-3.5" /> Leaderboard
              </Link>
              <UserButton />
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 relative">
          <div className="fade-up fade-up-1 mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-2">
                <span className="shimmer-text">Notes History</span>
              </h1>
              <p className="text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.42)" }}>
                Continue previous chats with your uploaded notes.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border" style={{ color: "rgba(255,255,255,0.55)", borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                <ArrowLeft className="size-3.5" /> Dashboard
              </Link>
              <Link to="/notes-upload" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border" style={{ color: "#fdba74", borderColor: "rgba(249,115,22,0.35)", background: "rgba(249,115,22,0.1)" }}>
                <Plus className="size-3.5" /> Upload New
              </Link>
            </div>
          </div>

          <div className="fade-up fade-up-2">
            {loading ? (
              <div className="rounded-2xl border p-8 text-center" style={{ background: "rgba(12,12,22,0.9)", borderColor: "rgba(249,115,22,0.2)" }}>
                <Loader2 className="size-7 animate-spin mx-auto mb-3" style={{ color: "#fdba74" }} />
                <p style={{ color: "rgba(255,255,255,0.45)" }}>Loading notes history...</p>
              </div>
            ) : notes.length === 0 ? (
              <div className="rounded-2xl border p-8 text-center" style={{ background: "rgba(12,12,22,0.9)", borderColor: "rgba(249,115,22,0.2)" }}>
                <NotebookPen className="size-8 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.35)" }} />
                <h2 className="text-lg font-bold mb-2">No notes uploaded yet</h2>
                <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.42)" }}>
                  Upload your first PDF to start chatting with your notes.
                </p>
                <Link to="/notes-upload" className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border" style={{ color: "#fdba74", borderColor: "rgba(249,115,22,0.35)", background: "rgba(249,115,22,0.1)" }}>
                  <Plus className="size-4" /> Upload Notes
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((note) => (
                  <article
                    key={note._id}
                    className="rounded-2xl border p-4 flex flex-col"
                    style={{ background: "rgba(12,12,22,0.9)", borderColor: "rgba(249,115,22,0.2)" }}
                  >
                    <h3 className="font-black text-base mb-2 line-clamp-2">{note.fileName}</h3>

                    <div className="text-xs space-y-1 mb-4" style={{ color: "rgba(255,255,255,0.48)" }}>
                      <p className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-3.5" /> {formatDate(note.uploadedAt)}
                      </p>
                      <p className="inline-flex items-center gap-1.5">
                        <MessageSquare className="size-3.5" /> {note.messageCount || 0} messages
                      </p>
                    </div>

                    <Link
                      to={`/talk-notes/${note._id}`}
                      className="mt-auto text-center px-4 py-2 rounded-lg text-sm font-semibold"
                      style={{ color: "#1a1008", background: "linear-gradient(135deg, #fdba74, #f97316)" }}
                    >
                      Open Chat
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notes_History;