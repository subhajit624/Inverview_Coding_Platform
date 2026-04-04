import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/react";
import {
  ArrowLeft,
  Bot,
  ChevronDown,
  ChevronUp,
  Clock3,
  History,
  Loader2,
  Sparkles,
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
  100% { background-position:  200% center; }
}
.fade-up   { animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both; }
.fade-up-1 { animation-delay: .05s; }
.fade-up-2 { animation-delay: .12s; }
.fade-up-3 { animation-delay: .20s; }
.shimmer-text {
  background: linear-gradient(90deg, #818cf8 0%, #34d399 50%, #818cf8 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
`;

const formatDate = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const InterViewHistory = () => {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState("");

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const loadHistory = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/ai-interview/history/${user.id}`);
        setHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load interview history.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [isLoaded, user?.id]);

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
            backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="fixed top-0 left-1/4 rounded-full pointer-events-none"
          style={{
            width: "450px",
            height: "450px",
            background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />

        <nav
          className="sticky top-0 z-40 border-b"
          style={{
            background: "rgba(8,8,15,0.88)",
            backdropFilter: "blur(24px)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border"
                style={{
                  color: "rgba(255,255,255,0.55)",
                  borderColor: "rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <ArrowLeft className="size-3.5" />
                Dashboard
              </Link>

              <Link
                to="/select-role-interview"
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border"
                style={{
                  color: "#4ade80",
                  borderColor: "rgba(74,222,128,0.32)",
                  background: "rgba(74,222,128,0.1)",
                }}
              >
                <Sparkles className="size-3.5" />
                New Interview
              </Link>
            </div>

            <UserButton />
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="fade-up fade-up-1 mb-8">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 mb-4"
              style={{ background: "rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.25)" }}
            >
              <History className="size-3.5" style={{ color: "#818cf8" }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                Completed AI Interviews
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              <span className="shimmer-text">Interview History</span>
            </h1>
            <p className="text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.42)" }}>
              Review your previous sessions, conversation flow, and interview scores.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border p-8 text-center"
              style={{ background: "rgba(12,12,22,0.88)", borderColor: "rgba(99,102,241,0.2)" }}
            >
              <Loader2 className="size-7 animate-spin mx-auto mb-3" style={{ color: "#818cf8" }} />
              <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading interview history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="rounded-2xl border p-8 text-center"
              style={{ background: "rgba(12,12,22,0.88)", borderColor: "rgba(99,102,241,0.2)" }}
            >
              <Bot className="size-8 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.35)" }} />
              <h2 className="text-lg font-bold mb-2">No interview history yet</h2>
              <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.42)" }}>
                Start your first AI interview to see detailed history here.
              </p>
              <Link
                to="/select-role-interview"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border"
                style={{
                  color: "#4ade80",
                  borderColor: "rgba(74,222,128,0.32)",
                  background: "rgba(74,222,128,0.1)",
                }}
              >
                <Sparkles className="size-4" />
                Start AI Interview
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => {
                const isOpen = expanded === item._id;
                const score = Number(item.overallScore || 0);

                return (
                  <article
                    key={item._id}
                    className={`fade-up rounded-2xl border p-4 sm:p-5`}
                    style={{
                      animationDelay: `${index * 0.04}s`,
                      background: "rgba(12,12,22,0.88)",
                      borderColor: isOpen ? "rgba(99,102,241,0.35)" : "rgba(99,102,241,0.18)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setExpanded((prev) => (prev === item._id ? "" : item._id))}
                      className="w-full text-left"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-lg text-white">{item.role}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs mt-1.5">
                            <span className="px-2 py-1 rounded-full border"
                              style={{ color: "#818cf8", borderColor: "rgba(99,102,241,0.35)", background: "rgba(99,102,241,0.12)" }}
                            >
                              {item.level}
                            </span>
                            <span className="px-2 py-1 rounded-full border"
                              style={{
                                color: item.status === "completed" ? "#4ade80" : "#facc15",
                                borderColor:
                                  item.status === "completed"
                                    ? "rgba(74,222,128,0.35)"
                                    : "rgba(250,204,21,0.35)",
                                background:
                                  item.status === "completed"
                                    ? "rgba(74,222,128,0.1)"
                                    : "rgba(250,204,21,0.1)",
                              }}
                            >
                              {item.status}
                            </span>
                            <span className="inline-flex items-center gap-1"
                              style={{ color: "rgba(255,255,255,0.45)" }}
                            >
                              <Clock3 className="size-3.5" />
                              {formatDate(item.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full border text-xs font-bold"
                            style={{
                              color: "#4ade80",
                              borderColor: "rgba(74,222,128,0.35)",
                              background: "rgba(74,222,128,0.1)",
                            }}
                          >
                            {score.toFixed(1)}/10
                          </span>
                          {isOpen ? (
                            <ChevronUp className="size-4" style={{ color: "rgba(255,255,255,0.5)" }} />
                          ) : (
                            <ChevronDown className="size-4" style={{ color: "rgba(255,255,255,0.5)" }} />
                          )}
                        </div>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="mt-4 pt-4 border-t"
                        style={{ borderColor: "rgba(255,255,255,0.08)" }}
                      >
                        <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
                          {item.overallFeedback || "No overall feedback available."}
                        </p>

                        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                          {(item.conversation || []).map((message, msgIndex) => {
                            const isAi = message.role === "ai";

                            return (
                              <div
                                key={`${item._id}-${msgIndex}`}
                                className={`flex ${isAi ? "justify-start" : "justify-end"}`}
                              >
                                <div
                                  className="max-w-[92%] sm:max-w-[78%] rounded-2xl px-3 py-2.5 border"
                                  style={{
                                    background: isAi ? "rgba(99,102,241,0.14)" : "rgba(0,0,0,0.35)",
                                    borderColor: isAi
                                      ? "rgba(99,102,241,0.28)"
                                      : "rgba(74,222,128,0.28)",
                                  }}
                                >
                                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.86)" }}>
                                    {message.content}
                                  </p>
                                  {!isAi && (
                                    <div className="mt-1.5 text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                                      {typeof message.score === "number" ? (
                                        <p>Score: {Number(message.score).toFixed(1)}/10</p>
                                      ) : null}
                                      {message.feedback ? <p>Feedback: {message.feedback}</p> : null}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InterViewHistory;
