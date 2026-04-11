import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserButton, useUser } from "@clerk/react";
import { ArrowLeft, Code2, Loader2, NotebookPen, Send, Trophy } from "lucide-react";
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

const formatTime = (value) => {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Talk_Notes = () => {
  const { id: noteId } = useParams();
  const { user } = useUser();
  const userId = user?.id;

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [fileName, setFileName] = useState("Your Notes");
  const [loadingSession, setLoadingSession] = useState(true);
  const [sending, setSending] = useState(false);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    const loadNote = async () => {
      if (!noteId || !userId) {
        return;
      }

      try {
        setLoadingSession(true);
        const { data } = await axiosInstance.get(`/notes/${noteId}`, {
          params: { userId },
        });

        setFileName(data?.fileName || "Your Notes");
        setMessages(Array.isArray(data?.messages) ? data.messages : []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load note chat.");
      } finally {
        setLoadingSession(false);
      }
    };

    loadNote();
  }, [noteId, userId]);

  const handleAsk = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question.");
      return;
    }

    if (!userId) {
      toast.error("User not found. Please sign in again.");
      return;
    }

    if (!noteId) {
      toast.error("Invalid note id.");
      return;
    }

    try {
      setSending(true);
      const { data } = await axiosInstance.post("/notes/ask", {
        question: question.trim(),
        noteId,
        userId,
      });

      setQuestion("");

      if (Array.isArray(data?.messages)) {
        setMessages(data.messages);
      } else {
        const fallbackAnswer = String(data?.answer || "No answer received.");
        setMessages((prev) => [
          ...prev,
          { role: "user", content: question.trim(), createdAt: new Date().toISOString() },
          { role: "assistant", content: fallbackAnswer, createdAt: new Date().toISOString() },
        ]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get answer.");
    } finally {
      setSending(false);
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

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 relative flex flex-col h-[calc(100vh-64px)]">
          <div className="fade-up fade-up-1 mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black mb-1">
                <span className="shimmer-text">Talk to Your Notes</span>
              </h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                {fileName}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/notes-history" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border" style={{ color: "#fdba74", borderColor: "rgba(249,115,22,0.35)", background: "rgba(249,115,22,0.1)" }}>
                <NotebookPen className="size-3.5" /> Notes History
              </Link>
              <Link to="/notes-upload" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border" style={{ color: "rgba(255,255,255,0.55)", borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                <ArrowLeft className="size-3.5" /> Upload New
              </Link>
            </div>
          </div>

          <div className="fade-up fade-up-2 flex-1 rounded-2xl border overflow-hidden flex flex-col" style={{ background: "rgba(12,12,22,0.9)", borderColor: "rgba(249,115,22,0.2)" }}>
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 space-y-3">
              {loadingSession ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="size-7 animate-spin mx-auto mb-2" style={{ color: "#fdba74" }} />
                    <p style={{ color: "rgba(255,255,255,0.45)" }}>Loading conversation...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <p className="font-semibold mb-1">No conversation yet</p>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                      Ask your first question.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message, index) => {
                  const isUser = message.role === "user";
                  return (
                    <div key={`${message.createdAt || "m"}-${index}`} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className="max-w-[92%] sm:max-w-[74%] rounded-2xl px-3.5 py-3 border"
                        style={{
                          background: isUser ? "rgba(79,70,229,0.24)" : "rgba(0,0,0,0.34)",
                          borderColor: isUser ? "rgba(129,140,248,0.45)" : "rgba(249,115,22,0.25)",
                        }}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className="text-[10px] mt-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}

              {sending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-3.5 py-2.5 border inline-flex items-center gap-2" style={{ background: "rgba(0,0,0,0.32)", borderColor: "rgba(249,115,22,0.25)", color: "rgba(255,255,255,0.75)" }}>
                    <Loader2 className="size-3.5 animate-spin" /> Thinking...
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>

            <div className="border-t p-3 sm:p-4 flex items-end gap-2" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={2}
                placeholder="Ask from your notes..."
                className="flex-1 rounded-xl border px-3.5 py-2.5 text-sm text-white outline-none resize-none"
                style={{ background: "rgba(8,8,15,0.92)", borderColor: "rgba(255,255,255,0.1)" }}
              />
              <button
                onClick={handleAsk}
                disabled={sending || !question.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-bold disabled:opacity-60"
                style={{ color: "#190f08", background: "linear-gradient(135deg, #fdba74, #f97316)" }}
              >
                <Send className="size-3.5" /> Send
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Talk_Notes;