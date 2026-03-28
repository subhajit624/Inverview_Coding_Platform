import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserButton } from "@clerk/react";
import {
  Code2, Plus, Users, Clock, ChevronRight, Search,
  Zap, CheckCircle2, RefreshCw, Trophy, ArrowRight,
  X, Calendar, User, UserCheck, Hash,
} from "lucide-react";
import problems from "../data/problems";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const DIFF_CONFIG = {
  Easy:   { color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.25)" },
  Medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)" },
  Hard:   { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)" },
};

// ── Session Detail Modal ──────────────────────────────────────────────────────
function SessionDetailModal({ sessionId, onClose }) {
  const [detail,  setDetail]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/session/${sessionId}`);
        setDetail(res.data.session);
      } catch {
        setError("Failed to load session details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sessionId]);

  const handleBackdrop = e => {
    if (e.target === e.currentTarget) onClose();
  };

  const diff = detail ? (DIFF_CONFIG[detail.difficulty] || DIFF_CONFIG.Easy) : null;

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border overflow-hidden"
        style={{
          background: "rgba(10,10,20,0.98)",
          borderColor: "rgba(99,102,241,0.25)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.1)",
        }}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <h3 className="font-bold text-base">Session Details</h3>
          <button
            onClick={onClose}
            className="size-7 flex items-center justify-center rounded-lg transition-all duration-200"
            style={{ color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center py-10">
              <div
                className="size-7 rounded-full border-2 animate-spin mb-3"
                style={{ borderColor: "rgba(99,102,241,0.5)", borderTopColor: "transparent" }}
              />
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>Loading...</p>
            </div>
          ) : error ? (
            <p className="text-center text-sm py-10" style={{ color: "#f87171" }}>{error}</p>
          ) : detail && (
            <div className="space-y-4">

              {/* Problem */}
              <div
                className="rounded-xl border p-4"
                style={{ background: "rgba(99,102,241,0.06)", borderColor: "rgba(99,102,241,0.18)" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2"
                  style={{ color: "rgba(129,140,248,0.6)" }}>Problem</p>
                <p className="font-bold text-base mb-2">{detail.problem}</p>
                {diff && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ color: diff.color, background: diff.bg, border: `1px solid ${diff.border}` }}>
                    {detail.difficulty}
                  </span>
                )}
              </div>

              {/* Participants */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2"
                  style={{ color: "rgba(255,255,255,0.25)" }}>Participants</p>
                <div className="space-y-2">

                  {/* Host */}
                  <div className="flex items-center gap-3 rounded-xl border p-3"
                    style={{ background: "rgba(52,211,153,0.04)", borderColor: "rgba(52,211,153,0.15)" }}>
                    <div className="size-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                      style={{ background: "rgba(52,211,153,0.15)" }}>
                      {detail.host?.profileImage
                        ? <img src={detail.host.profileImage} alt="" className="size-full object-cover" />
                        : <User className="size-4" style={{ color: "#34d399" }} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate">{detail.host?.name || "Unknown"}</p>
                      <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.35)" }}>
                        {detail.host?.email || ""}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{ color: "#34d399", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)" }}>
                      Host
                    </span>
                  </div>

                  {/* Partner */}
                  {detail.participant ? (
                    <div className="flex items-center gap-3 rounded-xl border p-3"
                      style={{ background: "rgba(99,102,241,0.05)", borderColor: "rgba(99,102,241,0.18)" }}>
                      <div className="size-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                        style={{ background: "rgba(99,102,241,0.15)" }}>
                        {detail.participant?.profileImage
                          ? <img src={detail.participant.profileImage} alt="" className="size-full object-cover" />
                          : <UserCheck className="size-4" style={{ color: "#818cf8" }} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold truncate">{detail.participant?.name || "Unknown"}</p>
                        <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.35)" }}>
                          {detail.participant?.email || ""}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                        style={{ color: "#818cf8", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}>
                        Partner
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl border p-3"
                      style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                      <div className="size-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "rgba(255,255,255,0.05)" }}>
                        <User className="size-4" style={{ color: "rgba(255,255,255,0.2)" }} />
                      </div>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>No partner joined</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Meta */}
              <div className="rounded-xl border p-4 space-y-2.5"
                style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1"
                  style={{ color: "rgba(255,255,255,0.25)" }}>Info</p>

                <div className="flex items-center gap-2">
                  <Calendar className="size-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Created{" "}
                    <span style={{ color: "rgba(255,255,255,0.75)" }}>
                      {new Date(detail.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}{" "}at{" "}
                      {new Date(detail.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Hash className="size-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
                  <span className="text-[11px] font-mono truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {detail.callId}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="size-2 rounded-full shrink-0"
                    style={{ background: detail.status === "active" ? "#34d399" : "rgba(255,255,255,0.2)" }}
                  />
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Status:{" "}
                    <span style={{
                      color: detail.status === "active" ? "#34d399" : "rgba(255,255,255,0.6)",
                      fontWeight: 600,
                    }}>
                      {detail.status}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function InterviewDashboard() {
  const navigate = useNavigate();

  const [selectedProblem, setSelectedProblem] = useState(problems[0]);
  const [search,          setSearch]          = useState("");
  const [showDropdown,    setShowDropdown]    = useState(false);
  const [creating,        setCreating]        = useState(false);

  const [activeSessions, setActiveSessions] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loadingActive,  setLoadingActive]  = useState(true);
  const [joiningId,      setJoiningId]      = useState(null);
  const [refreshing,     setRefreshing]     = useState(false);

  // ── Modal ──────────────────────────────────────────────────────────────────
  const [modalSessionId, setModalSessionId] = useState(null);

  const filtered = problems.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const fetchSessions = async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    else setLoadingActive(true);
    try {
      const [activeRes, recentRes] = await Promise.all([
        axiosInstance.get("/session/active"),
        axiosInstance.get("/session/my-recent"),
      ]);
      setActiveSessions(activeRes.data.sessions);
      setRecentSessions(recentRes.data.sessions);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    } finally {
      setLoadingActive(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchSessions(); }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await axiosInstance.post("/session/", {
        problem: selectedProblem.title,
        difficulty: selectedProblem.difficulty,
      });
      toast.success("Session created!", {
        style: { background: "rgba(12,12,22,0.95)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "12px" },
        iconTheme: { primary: "#34d399", secondary: "#08080f" },
      });
      navigate(`/interview/${res.data.session._id}`);
    } catch (err) {
      toast.error("Failed to create session", {
        style: { background: "rgba(12,12,22,0.95)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "12px" },
      });
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (sessionId) => {
    setJoiningId(sessionId);
    try {
      await axiosInstance.post(`/session/${sessionId}/join`);
      navigate(`/interview/${sessionId}`);
    } catch (err) {
      const msg = err.response?.data?.error || "";
      if (msg.includes("Host") || msg.includes("already")) {
        navigate(`/interview/${sessionId}`);
      } else {
        toast.error(msg || "Failed to join session", {
          style: { background: "rgba(12,12,22,0.95)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "12px" },
        });
      }
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#08080f", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      {/* Modal */}
      {modalSessionId && (
        <SessionDetailModal
          sessionId={modalSessionId}
          onClose={() => setModalSessionId(null)}
        />
      )}

      {/* BG GRID */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="fixed bottom-1/3 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b"
        style={{ background: "rgba(8,8,15,0.85)", backdropFilter: "blur(24px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="size-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #22c55e)" }}>
              <Code2 className="size-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Courier New', monospace" }}>
              Crack<span style={{ color: "#818cf8" }}>It</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/problems"
              className="text-xs px-3 py-1.5 rounded-lg border transition-all duration-200"
              style={{ color: "rgba(255,255,255,0.45)", borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#818cf8"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
              Problems
            </Link>
            <Link to="/leaderboard"
              className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200"
              style={{ color: "rgba(255,255,255,0.45)", borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#f59e0b"; e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
              <Trophy className="size-3.5" />
              <span className="hidden sm:inline">Leaderboard</span>
            </Link>
            <UserButton />
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
            Interview{" "}
            <span style={{
              background: "linear-gradient(135deg, #818cf8 0%, #34d399 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Sessions</span>
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Practice mock interviews with a peer — live video, shared code editor, real problems.
          </p>
        </div>

        {/* CREATE + STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-8">

          <div className="lg:col-span-3 rounded-2xl border p-6"
            style={{ background: "rgba(12,12,22,0.8)", borderColor: "rgba(99,102,241,0.2)" }}>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="size-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(99,102,241,0.15)" }}>
                <Plus className="size-4" style={{ color: "#818cf8" }} />
              </div>
              <div>
                <h2 className="font-bold text-base leading-none">Create Session</h2>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Pick a problem and invite a partner
                </p>
              </div>
            </div>

            {/* Selector */}
            <div className="relative mb-4">
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,0.25)" }}>Select Problem</label>

              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm text-left transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: showDropdown ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.85)",
                  boxShadow: showDropdown ? "0 0 0 3px rgba(99,102,241,0.1)" : "none",
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="truncate font-medium">{selectedProblem.title}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      color: DIFF_CONFIG[selectedProblem.difficulty].color,
                      background: DIFF_CONFIG[selectedProblem.difficulty].bg,
                      border: `1px solid ${DIFF_CONFIG[selectedProblem.difficulty].border}`,
                    }}>
                    {selectedProblem.difficulty}
                  </span>
                </div>
                <ChevronRight
                  className={`size-4 shrink-0 ml-2 transition-transform duration-200 ${showDropdown ? "rotate-90" : ""}`}
                  style={{ color: "rgba(255,255,255,0.3)" }}
                />
              </button>

              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border z-50 overflow-hidden"
                  style={{
                    background: "rgba(10,10,20,0.99)",
                    borderColor: "rgba(99,102,241,0.3)",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
                  }}>
                  <div className="p-3 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.04)" }}>
                      <Search className="size-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
                      <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search problems..."
                        className="bg-transparent text-xs outline-none flex-1 placeholder:text-zinc-600"
                        style={{ color: "rgba(255,255,255,0.8)" }}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto" style={{ maxHeight: "220px" }}>
                    {filtered.length === 0 ? (
                      <p className="px-4 py-6 text-center text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                        No problems found
                      </p>
                    ) : filtered.map(p => {
                      const isSelected = selectedProblem.id === p.id;
                      return (
                        <button key={p.id}
                          onClick={() => { setSelectedProblem(p); setShowDropdown(false); setSearch(""); }}
                          className="w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-all duration-150"
                          style={{ background: isSelected ? "rgba(99,102,241,0.12)" : "transparent", color: "rgba(255,255,255,0.75)" }}
                          onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "rgba(99,102,241,0.06)"; }}
                          onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                        >
                          <div className="flex items-center gap-2 min-w-0 mr-3">
                            {isSelected && <CheckCircle2 className="size-3.5 shrink-0" style={{ color: "#818cf8" }} />}
                            <span className="truncate">{p.title}</span>
                          </div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                            style={{
                              color: DIFF_CONFIG[p.difficulty].color,
                              background: DIFF_CONFIG[p.difficulty].bg,
                              border: `1px solid ${DIFF_CONFIG[p.difficulty].border}`,
                            }}>
                            {p.difficulty}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleCreate} disabled={creating}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-50"
              style={{
                background: creating ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #6366f1, #34d399)",
                boxShadow: creating ? "none" : "0 0 30px rgba(99,102,241,0.35)",
              }}>
              <Zap className="size-4" />
              {creating ? "Creating..." : "Start Session"}
            </button>
          </div>

          {/* Stats */}
          <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-3">
            <div className="rounded-2xl border p-5"
              style={{ background: "rgba(99,102,241,0.06)", borderColor: "rgba(99,102,241,0.2)" }}>
              <div className="flex items-center gap-2 mb-2" style={{ color: "#818cf8" }}>
                <Users className="size-4" />
                <span className="text-xs font-semibold">Active Now</span>
              </div>
              <p className="text-3xl font-black" style={{ color: "#818cf8" }}>{activeSessions.length}</p>
              <p className="text-xs mt-1" style={{ color: "rgba(129,140,248,0.45)" }}>open sessions</p>
            </div>
            <div className="rounded-2xl border p-5"
              style={{ background: "rgba(52,211,153,0.06)", borderColor: "rgba(52,211,153,0.2)" }}>
              <div className="flex items-center gap-2 mb-2" style={{ color: "#34d399" }}>
                <Clock className="size-4" />
                <span className="text-xs font-semibold">Attended</span>
              </div>
              <p className="text-3xl font-black" style={{ color: "#34d399" }}>{recentSessions.length}</p>
              <p className="text-xs mt-1" style={{ color: "rgba(52,211,153,0.45)" }}>past sessions</p>
            </div>
          </div>
        </div>

        {/* ACTIVE SESSIONS */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Active Sessions</h2>
            <button onClick={() => fetchSessions(true)} disabled={refreshing}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 disabled:opacity-50"
              style={{ color: "rgba(255,255,255,0.4)", borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
              onMouseEnter={e => e.currentTarget.style.color = "#818cf8"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
              <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {loadingActive ? (
            <div className="rounded-2xl border p-10 flex items-center justify-center"
              style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(12,12,22,0.8)" }}>
              <div className="text-center">
                <div className="size-6 border-2 rounded-full animate-spin mx-auto mb-3"
                  style={{ borderColor: "rgba(99,102,241,0.5)", borderTopColor: "transparent" }} />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Loading sessions...</p>
              </div>
            </div>
          ) : activeSessions.length === 0 ? (
            <div className="rounded-2xl border p-10 text-center"
              style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(12,12,22,0.8)" }}>
              <Users className="size-10 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.1)" }} />
              <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>No active sessions right now</p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>Be the first to create one!</p>
            </div>
          ) : (
            <div className="rounded-2xl border overflow-hidden"
              style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(12,12,22,0.8)" }}>
              <div className="grid grid-cols-12 px-4 sm:px-6 py-3 border-b text-xs font-semibold uppercase tracking-widest"
                style={{ borderColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.25)" }}>
                <div className="col-span-5">Problem</div>
                <div className="col-span-3">Host</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">Action</div>
              </div>

              {activeSessions.map((session, idx) => {
                const diff           = DIFF_CONFIG[session.difficulty] || DIFF_CONFIG.Easy;
                const hasParticipant = !!session.participant;
                const isLast         = idx === activeSessions.length - 1;
                return (
                  <div key={session._id}
                    className="grid grid-cols-12 px-4 sm:px-6 py-4 items-center transition-all duration-200"
                    style={{ borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

                    <div className="col-span-5 min-w-0 pr-2">
                      <p className="text-sm font-semibold truncate" style={{ color: "rgba(255,255,255,0.8)" }}>
                        {session.problem}
                      </p>
                      <span className="inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1"
                        style={{ color: diff.color, background: diff.bg, border: `1px solid ${diff.border}` }}>
                        {session.difficulty}
                      </span>
                    </div>

                    <div className="col-span-3 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <div className="size-2 rounded-full shrink-0" style={{ background: "#34d399" }} />
                        <span className="text-xs truncate" style={{ color: "rgba(255,255,255,0.5)" }}>
                          {session.host?.name || "Host"}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <span className="text-xs font-medium"
                        style={{ color: hasParticipant ? "rgba(248,113,113,0.7)" : "rgba(52,211,153,0.7)" }}>
                        {hasParticipant ? "Full" : "Open"}
                      </span>
                    </div>

                    <div className="col-span-2 flex justify-end">
                      <button
                        onClick={() => handleJoin(session._id)}
                        disabled={joiningId === session._id || hasParticipant}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: hasParticipant ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #6366f1, #34d399)",
                          color:      hasParticipant ? "rgba(255,255,255,0.35)" : "white",
                          boxShadow:  hasParticipant ? "none" : "0 0 16px rgba(99,102,241,0.3)",
                        }}>
                        {joiningId === session._id ? "..." : hasParticipant ? "Full" : (
                          <>Join <ArrowRight className="size-3" /></>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RECENT SESSIONS — clickable rows */}
        {recentSessions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">My Recent Sessions</h2>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                Click any session to view details
              </p>
            </div>
            <div className="space-y-3">
              {recentSessions.map(session => {
                const diff = DIFF_CONFIG[session.difficulty] || DIFF_CONFIG.Easy;
                return (
                  <button
                    key={session._id}
                    onClick={() => setModalSessionId(session._id)}
                    className="w-full rounded-2xl border px-5 py-4 flex items-center justify-between gap-4 transition-all duration-200 text-left group"
                    style={{ background: "rgba(12,12,22,0.6)", borderColor: "rgba(255,255,255,0.06)" }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
                      e.currentTarget.style.background  = "rgba(99,102,241,0.04)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.background  = "rgba(12,12,22,0.6)";
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-semibold text-sm truncate" style={{ color: "rgba(255,255,255,0.65)" }}>
                          {session.problem}
                        </p>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                          style={{ color: diff.color, background: diff.bg, border: `1px solid ${diff.border}` }}>
                          {session.difficulty}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ color: "#34d399", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
                          Completed
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>
                        {new Date(session.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ color: "#818cf8" }}>
                        View details
                      </span>
                      <ChevronRight
                        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        style={{ color: "rgba(255,255,255,0.2)" }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}