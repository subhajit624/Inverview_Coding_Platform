import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Code2,
  Trophy,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileSearch,
  FileText,
  Plus,
  Sparkles,
  ExternalLink,
  ArrowLeft,
  CalendarDays,
} from "lucide-react";
import toast from "react-hot-toast";
import { UserButton } from "@clerk/react";
import axiosInstance from "../lib/axios";

// ── same keyframes as Dashboard & ResumeUpload ────────────────────────────
const STYLES = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes float {
  0%,100% { transform: translateY(0);    }
  50%      { transform: translateY(-6px); }
}
@keyframes pulse-skeleton {
  0%,100% { opacity: 0.4; }
  50%      { opacity: 0.7; }
}
@keyframes expandDown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0);    }
}
.fade-up   { animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both; }
.fade-up-1 { animation-delay: .05s; }
.fade-up-2 { animation-delay: .12s; }
.fade-up-3 { animation-delay: .20s; }
.fade-up-4 { animation-delay: .28s; }
.fade-up-5 { animation-delay: .36s; }
.shimmer-text {
  background: linear-gradient(90deg, #c084fc 0%, #818cf8 35%, #34d399 70%, #c084fc 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
.skeleton { animation: pulse-skeleton 1.6s ease-in-out infinite; }
.expand-down { animation: expandDown .25s cubic-bezier(.22,1,.36,1) both; }
.card-hover { transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
`;

// ── helpers ───────────────────────────────────────────────────────────────
const formatDate = (value) => {
  if (!value) return "Unknown date";
  return new Date(value).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
};

const getScoreTheme = (score) => {
  if (score >= 70)
    return {
      stroke: "#22c55e",
      color: "#4ade80",
      bg: "rgba(34,197,94,0.1)",
      border: "rgba(34,197,94,0.25)",
      label: "Strong",
      track: "rgba(34,197,94,0.12)",
    };
  if (score >= 40)
    return {
      stroke: "#f59e0b",
      color: "#fcd34d",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.25)",
      label: "Needs Work",
      track: "rgba(245,158,11,0.12)",
    };
  return {
    stroke: "#ef4444",
    color: "#f87171",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.25)",
    label: "Weak",
    track: "rgba(239,68,68,0.12)",
  };
};

// ── mini score ring ───────────────────────────────────────────────────────
function ScoreRing({ score, size = 52 }) {
  const theme = getScoreTheme(score);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, Math.max(0, score)) / 100) * circ;
  const cx = size / 2;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" style={{ position: "absolute" }}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={theme.track} strokeWidth="5" />
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke={theme.stroke}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <span className="text-xs font-black" style={{ color: theme.color }}>{score}</span>
    </div>
  );
}

// ── skeleton card ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/07 p-5 space-y-3"
      style={{ background: "rgba(12,12,22,0.85)", borderColor: "rgba(255,255,255,0.07)" }}>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="skeleton h-5 w-48 rounded-lg" style={{ background: "rgba(255,255,255,0.08)" }} />
          <div className="skeleton h-4 w-32 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }} />
        </div>
        <div className="skeleton size-12 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>
      <div className="skeleton h-9 w-28 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }} />
    </div>
  );
}

// ── expanded detail panel ─────────────────────────────────────────────────
function DetailPanel({ resume }) {
  const sectionKeys = ["summary", "experience", "skills", "education", "projects"];
  const sectionColors = ["#818cf8", "#c084fc", "#4ade80", "#f59e0b", "#38bdf8"];

  return (
    <div className="expand-down mt-5 rounded-xl border p-4 sm:p-5 space-y-5"
      style={{ background: "rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.07)" }}>

      {/* PDF button */}
      <a
        href={resume.cloudinaryUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
        style={{ borderColor: "rgba(168,85,247,0.35)", color: "#c084fc", background: "rgba(168,85,247,0.08)" }}
      >
        <ExternalLink className="size-4" />
        View PDF
      </a>

      {/* Keywords */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-xl border p-4"
          style={{ background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.15)" }}>
          <p className="text-sm font-bold mb-3" style={{ color: "#4ade80" }}>
            ✓ Matched ({resume.matchedKeywords?.length ?? 0})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(resume.matchedKeywords?.length ? resume.matchedKeywords : ["No matches"]).map((kw, i) => (
              <span key={i} className="rounded-full px-2.5 py-1 text-xs"
                style={{ background: "rgba(34,197,94,0.12)", color: "#86efac", border: "1px solid rgba(34,197,94,0.2)" }}>
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-4"
          style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.15)" }}>
          <p className="text-sm font-bold mb-3" style={{ color: "#f87171" }}>
            ✗ Missing ({resume.missingKeywords?.length ?? 0})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(resume.missingKeywords?.length ? resume.missingKeywords : ["No gaps"]).map((kw, i) => (
              <span key={i} className="rounded-full px-2.5 py-1 text-xs"
                style={{ background: "rgba(239,68,68,0.12)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Section feedback */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider mb-3"
          style={{ color: "rgba(255,255,255,0.25)" }}>
          Section Feedback
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {sectionKeys.map((key, i) => (
            <div key={key} className="rounded-xl border p-3.5"
              style={{ background: "rgba(12,12,22,0.6)", borderColor: "rgba(255,255,255,0.07)" }}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: sectionColors[i] }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                {resume.sectionFeedback?.[key] || "No feedback provided."}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths + Suggestions */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-xl border p-4"
          style={{ background: "rgba(34,197,94,0.05)", borderColor: "rgba(34,197,94,0.15)" }}>
          <p className="text-sm font-bold mb-3 inline-flex items-center gap-2" style={{ color: "#4ade80" }}>
            <Sparkles className="size-3.5" /> Strengths
          </p>
          <ul className="space-y-2">
            {(resume.strengths?.length ? resume.strengths : ["No strengths provided"]).map((s, i) => (
              <li key={i} className="flex gap-2 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                <CheckCircle2 className="size-3.5 mt-0.5 shrink-0" style={{ color: "#4ade80" }} />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border p-4"
          style={{ background: "rgba(168,85,247,0.05)", borderColor: "rgba(168,85,247,0.15)" }}>
          <p className="text-sm font-bold mb-3 inline-flex items-center gap-2" style={{ color: "#c084fc" }}>
            <FileText className="size-3.5" /> Suggestions
          </p>
          <ul className="space-y-2">
            {(resume.overallSuggestions?.length ? resume.overallSuggestions : ["No suggestions provided"]).map((s, i) => (
              <li key={i} className="flex gap-2 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                <span className="mt-1.5 size-1.5 rounded-full shrink-0" style={{ background: "#a855f7" }} />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── resume card ───────────────────────────────────────────────────────────
function ResumeCard({ resume, isExpanded, onToggle, index }) {
  const score = Number(resume.atsScore || 0);
  const theme = getScoreTheme(score);

  return (
    <div
      className={`fade-up rounded-2xl border overflow-hidden transition-all duration-300`}
      style={{
        animationDelay: `${0.05 * index}s`,
        background: "rgba(12,12,22,0.85)",
        borderColor: isExpanded ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.07)",
        boxShadow: isExpanded ? "0 0 0 1px rgba(168,85,247,0.15), 0 16px 48px rgba(168,85,247,0.08)" : "none",
      }}
    >
      {/* Accent top line when expanded */}
      <div
        className="h-[2px] transition-opacity duration-300"
        style={{
          background: "linear-gradient(90deg, transparent, #a855f7, #6366f1, transparent)",
          opacity: isExpanded ? 1 : 0,
        }}
      />

      <div className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Left — title + date */}
          <div className="flex items-start gap-4">
            <ScoreRing score={score} size={52} />
            <div>
              <h3 className="text-lg font-black text-white leading-tight">{resume.jobRole}</h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <CalendarDays className="size-3" style={{ color: "rgba(255,255,255,0.3)" }} />
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {formatDate(resume.createdAt)}
                </p>
              </div>
              {/* Score label badge */}
              <span
                className="inline-block mt-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                style={{ background: theme.bg, color: theme.color, border: `1px solid ${theme.border}` }}
              >
                {theme.label} · {score}/100
              </span>
            </div>
          </div>

          {/* Right — toggle button */}
          <button
            type="button"
            onClick={() => onToggle(resume._id)}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 shrink-0 hover:scale-[1.02]"
            style={{
              borderColor: isExpanded ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.1)",
              color: isExpanded ? "#c084fc" : "rgba(255,255,255,0.55)",
              background: isExpanded ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.03)",
            }}
          >
            {isExpanded ? "Collapse" : "View Details"}
            {isExpanded
              ? <ChevronUp className="size-4" />
              : <ChevronDown className="size-4" />
            }
          </button>
        </div>

        {isExpanded && <DetailPanel resume={resume} />}
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────
export default function ResumeHistory() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/resume");
        setResumes(Array.isArray(data) ? data : []);
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to load resume history.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sorted = useMemo(
    () => [...resumes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [resumes]
  );

  const toggleExpanded = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <>
      <style>{STYLES}</style>

      <div
        className="min-h-screen text-white overflow-x-hidden"
        style={{ background: "#08080f", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
      >
        {/* BG GRID */}
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(168,85,247,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.025) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />

        {/* Glow blobs */}
        <div className="fixed top-0 left-1/4 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)", filter: "blur(70px)" }} />
        <div className="fixed bottom-0 right-1/4 w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)", filter: "blur(70px)" }} />
        <div className="fixed top-1/2 left-0 w-[280px] h-[280px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)", filter: "blur(60px)" }} />

        {/* ── NAVBAR — identical to Dashboard ── */}
        <nav className="sticky top-0 z-50 border-b fade-up"
          style={{ background: "rgba(8,8,15,0.88)", backdropFilter: "blur(24px)", borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="size-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6366f1, #22c55e)" }}>
                <Code2 className="size-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight hidden sm:block"
                style={{ fontFamily: "'Courier New', monospace" }}>
                Crack<span style={{ color: "#818cf8" }}>It</span>
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/problems"
                className="text-xs px-3 py-1.5 rounded-lg border transition-all duration-200"
                style={{ color: "rgba(255,255,255,0.45)", borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#818cf8"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
                Problems
              </Link>
              <Link to="/leaderboard"
                className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200"
                style={{ color: "rgba(255,255,255,0.45)", borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#f59e0b"; e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
                <Trophy className="size-3.5" /> Leaderboard
              </Link>
              <UserButton />
            </div>
          </div>
        </nav>

        {/* ── CONTENT ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 relative">

          {/* ── PAGE HEADER ── */}
          <div className="mb-10 sm:mb-12">
            {/* Chip */}
            <div className="fade-up fade-up-1 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 mb-5"
              style={{ background: "rgba(168,85,247,0.07)", borderColor: "rgba(168,85,247,0.2)" }}>
              <div className="size-1.5 rounded-full" style={{ background: "#c084fc", animation: "float 2s ease-in-out infinite" }} />
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
                {loading ? "Loading..." : `${sorted.length} ${sorted.length === 1 ? "Analysis" : "Analyses"}`}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="fade-up fade-up-2 font-black tracking-tight leading-none mb-3"
                  style={{ fontSize: "clamp(2rem, 6vw, 3rem)" }}>
                  <span className="shimmer-text">Resume History</span>
                </h1>
                <p className="fade-up fade-up-2 text-sm sm:text-base max-w-md"
                  style={{ color: "rgba(255,255,255,0.38)", lineHeight: 1.7 }}>
                  Track your ATS scores and improvement over time.
                </p>
              </div>

              <div className="fade-up fade-up-3 flex items-center gap-2 shrink-0">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200"
                  style={{ color: "rgba(255,255,255,0.45)", borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#818cf8"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  <ArrowLeft className="size-3.5" /> Dashboard
                </Link>
                <Link
                  to="/resume-upload"
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)", color: "#fff" }}
                >
                  <Plus className="size-3.5" /> New Analysis
                </Link>
              </div>
            </div>
          </div>

          {/* ── DIVIDER ── */}
          <div className="fade-up fade-up-3 flex items-center gap-4 mb-8">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: "rgba(255,255,255,0.2)" }}>
              Past Analyses
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
          </div>

          {/* ── LOADING ── */}
          {loading && (
            <div className="space-y-4 fade-up fade-up-4">
              {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
            </div>
          )}

          {/* ── ERROR ── */}
          {!loading && error && (
            <div className="fade-up fade-up-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {/* ── EMPTY STATE ── */}
          {!loading && !error && sorted.length === 0 && (
            <div
              className="fade-up fade-up-4 rounded-2xl border px-6 py-16 text-center"
              style={{ background: "rgba(12,12,22,0.85)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <div
                className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl border"
                style={{ background: "rgba(168,85,247,0.08)", borderColor: "rgba(168,85,247,0.2)" }}
              >
                <FileSearch className="size-7" style={{ color: "#c084fc" }} />
              </div>
              <h2 className="text-xl font-black mb-2 text-white">No analyses yet</h2>
              <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
                Run your first ATS scan to start tracking your improvement over time.
              </p>
              <Link
                to="/resume-upload"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.01]"
                style={{ background: "linear-gradient(135deg, #a855f7, #6366f1 50%, #22c55e)" }}
              >
                <Plus className="size-4" />
                Analyze your first resume
              </Link>
            </div>
          )}

          {/* ── RESUME LIST ── */}
          {!loading && !error && sorted.length > 0 && (
            <div className="space-y-4">
              {sorted.map((resume, i) => (
                <ResumeCard
                  key={resume._id}
                  resume={resume}
                  index={i}
                  isExpanded={expandedId === resume._id}
                  onToggle={toggleExpanded}
                />
              ))}
            </div>
          )}

          {/* ── FOOTER NOTE ── */}
          <p className="fade-up fade-up-5 text-center text-xs mt-12 sm:mt-16"
            style={{ color: "rgba(255,255,255,0.15)" }}>
            Lets make it big · CrackIt
          </p>
        </div>
      </div>
    </>
  );
}