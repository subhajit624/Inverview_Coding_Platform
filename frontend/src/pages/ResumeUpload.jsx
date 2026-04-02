import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Code2,
  Trophy,
  CheckCircle2,
  CircleAlert,
  FileText,
  Loader2,
  RefreshCcw,
  Sparkles,
  UploadCloud,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { UserButton } from "@clerk/react";
import axiosInstance from "../lib/axios";

// ── same animation keyframes as Dashboard ────────────────────────────────
const STYLES = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes pulse-ring {
  0%,100% { box-shadow: 0 0 0 0px rgba(168,85,247,0.25); }
  50%      { box-shadow: 0 0 0 8px rgba(168,85,247,0);   }
}
@keyframes float {
  0%,100% { transform: translateY(0);    }
  50%      { transform: translateY(-6px); }
}
@keyframes spin-ring {
  from { stroke-dashoffset: 488; }
  to   { stroke-dashoffset: 0;   }
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
.card-hover { transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
.card-hover:hover { transform: translateY(-3px) scale(1.005); }
.ring-animate {
  transition: stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1);
}
`;

// ── helpers ───────────────────────────────────────────────────────────────
const isPdfFile = (f) =>
  !!f && (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));

const getScoreTheme = (score) => {
  if (score >= 70)
    return {
      stroke: "#22c55e",
      trackStroke: "rgba(34,197,94,0.15)",
      glowColor: "rgba(34,197,94,0.25)",
      badgeColor: "#4ade80",
      badgeBg: "rgba(34,197,94,0.12)",
      badgeBorder: "rgba(34,197,94,0.3)",
      label: "Strong",
    };
  if (score >= 40)
    return {
      stroke: "#f59e0b",
      trackStroke: "rgba(245,158,11,0.15)",
      glowColor: "rgba(245,158,11,0.2)",
      badgeColor: "#fcd34d",
      badgeBg: "rgba(245,158,11,0.12)",
      badgeBorder: "rgba(245,158,11,0.3)",
      label: "Needs Work",
    };
  return {
    stroke: "#ef4444",
    trackStroke: "rgba(239,68,68,0.15)",
    glowColor: "rgba(239,68,68,0.2)",
    badgeColor: "#f87171",
    badgeBg: "rgba(239,68,68,0.12)",
    badgeBorder: "rgba(239,68,68,0.3)",
    label: "Weak",
  };
};

// ── section accordion item ────────────────────────────────────────────────
function SectionCard({ label, value, index }) {
  const [open, setOpen] = useState(false);
  const colors = ["#818cf8", "#c084fc", "#4ade80", "#f59e0b", "#38bdf8"];
  const color = colors[index % colors.length];

  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      className="w-full text-left rounded-xl border border-white/10 bg-black/20 p-4 transition-all hover:border-white/20"
      style={{ boxShadow: open ? `0 0 0 1px ${color}30` : "none", borderColor: open ? `${color}40` : undefined }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold" style={{ color }}>
          {label}
        </span>
        <span
          className="text-xs shrink-0 transition-transform duration-200"
          style={{ color: "rgba(255,255,255,0.3)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </span>
      </div>
      {open && (
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
          {value}
        </p>
      )}
    </button>
  );
}

// ── main component ────────────────────────────────────────────────────────
export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [animateRing, setAnimateRing] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!result) { setAnimateRing(false); return; }
    const frame = requestAnimationFrame(() => setAnimateRing(true));
    return () => cancelAnimationFrame(frame);
  }, [result]);

  const score = result?.atsScore ?? 0;
  const theme = getScoreTheme(score);

  const ring = useMemo(() => {
    const r = 78;
    const circ = 2 * Math.PI * r;
    const offset = circ - (animateRing ? (Math.min(100, Math.max(0, score)) / 100) * circ : 0);
    return { r, circ, offset };
  }, [score, animateRing]);

  const sectionEntries = useMemo(() => {
    if (!result?.sectionFeedback) return [];
    return ["summary", "experience", "skills", "education", "projects"].map((k) => ({
      key: k,
      label: k.charAt(0).toUpperCase() + k.slice(1),
      value: result.sectionFeedback[k] || "No feedback provided.",
    }));
  }, [result]);

  const handleFile = (f) => {
    if (!f) return;
    if (!isPdfFile(f)) {
      setError("Only PDF files are allowed.");
      toast.error("Please upload a PDF resume only.");
      return;
    }
    setError("");
    setFile(f);
  };

  const resetToForm = () => {
    setResult(null); setError(""); setFile(null);
    setJobRole(""); setJobDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file)          return setError("Please select a PDF resume.");
    if (!jobRole.trim()) return setError("Job Role is required.");

    const fd = new FormData();
    fd.append("resume", file);
    fd.append("job_role", jobRole.trim());
    fd.append("job_description", jobDescription.trim());

    try {
      setLoading(true); setError("");
      const { data } = await axiosInstance.post("/resume/analyze", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult({
        cloudinaryUrl:      data.cloudinaryUrl      ?? data.cloudinary_url      ?? "",
        atsScore:           data.atsScore            ?? data.ats_score           ?? 0,
        matchedKeywords:    data.matchedKeywords     ?? data.matched_keywords    ?? [],
        missingKeywords:    data.missingKeywords     ?? data.missing_keywords    ?? [],
        sectionFeedback:    data.sectionFeedback     ?? data.section_feedback    ?? {},
        overallSuggestions: data.overallSuggestions  ?? data.overall_suggestions ?? [],
        strengths:          data.strengths           ?? [],
      });
      toast.success("Resume analyzed!");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.detail || "Analysis failed. Try again.";
      setError(msg);
      toast.error(msg);
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
        {/* BG GRID — identical to Dashboard */}
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(168,85,247,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.025) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />

        {/* Glow blobs */}
        <div className="fixed top-0 right-1/4 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)", filter: "blur(70px)" }} />
        <div className="fixed bottom-0 left-1/4 w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)", filter: "blur(70px)" }} />
        <div className="fixed top-1/2 right-0 w-[280px] h-[280px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)", filter: "blur(60px)" }} />

        {/* ── NAVBAR — identical structure to Dashboard ── */}
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
            {/* Breadcrumb chip */}
            <div className="fade-up fade-up-1 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 mb-5"
              style={{ background: "rgba(168,85,247,0.07)", borderColor: "rgba(168,85,247,0.2)" }}>
              <div className="size-1.5 rounded-full" style={{ background: "#c084fc", animation: "float 2s ease-in-out infinite" }} />
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
                AI Powered
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1
                  className="fade-up fade-up-2 font-black tracking-tight leading-none mb-3"
                  style={{ fontSize: "clamp(2rem, 6vw, 3rem)" }}
                >
                  <span className="shimmer-text">Resume Analyzer</span>
                </h1>
                <p className="fade-up fade-up-2 text-sm sm:text-base max-w-md"
                  style={{ color: "rgba(255,255,255,0.38)", lineHeight: 1.7 }}>
                  Get your resume scored, keyword-matched, and AI-reviewed for any job role.
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
                  to="/resume-history"
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200"
                  style={{ color: "rgba(255,255,255,0.45)", borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#c084fc"; e.currentTarget.style.borderColor = "rgba(168,85,247,0.35)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  <FileText className="size-3.5" /> History
                </Link>
              </div>
            </div>
          </div>

          {/* ── DIVIDER ── */}
          <div className="fade-up fade-up-3 flex items-center gap-4 mb-8">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: "rgba(255,255,255,0.2)" }}>
              {result ? "Your Results" : "Upload & Analyze"}
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
          </div>

          {/* ═══════════════ FORM STATE ═══════════════ */}
          {!result ? (
            <form onSubmit={handleSubmit} className="fade-up fade-up-4 space-y-5">

              {/* Drop zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
                className="cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300"
                style={{
                  background: dragOver ? "rgba(168,85,247,0.07)" : "rgba(12,12,22,0.85)",
                  borderColor: dragOver ? "#a855f7" : file ? "#22c55e" : "rgba(255,255,255,0.1)",
                  boxShadow: dragOver ? "0 0 50px rgba(168,85,247,0.2)" : file ? "0 0 30px rgba(34,197,94,0.1)" : "none",
                }}
              >
                <div
                  className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border"
                  style={{
                    background: file ? "rgba(34,197,94,0.1)" : "rgba(168,85,247,0.1)",
                    borderColor: file ? "rgba(34,197,94,0.25)" : "rgba(168,85,247,0.25)",
                    animation: dragOver ? "pulse-ring 1.5s infinite" : "none",
                  }}
                >
                  <UploadCloud className="size-7" style={{ color: file ? "#4ade80" : "#c084fc" }} />
                </div>

                {file ? (
                  <>
                    <p className="font-semibold text-base text-white">File ready</p>
                    <p className="mt-2 text-sm font-medium" style={{ color: "#4ade80" }}>{file.name}</p>
                    <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Click to replace</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-base text-white">Drag and drop your PDF here</p>
                    <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>or click to browse from your device</p>
                    <p className="mt-3 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>PDF only · max 5MB</p>
                  </>
                )}
              </div>

              <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />

              {/* Job Role + JD side-by-side on large screens */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Job Role <span style={{ color: "#f87171" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="e.g. Full Stack Developer"
                    className="w-full rounded-xl border px-4 py-3 text-sm text-white outline-none transition-all duration-200"
                    style={{
                      background: "rgba(12,12,22,0.85)",
                      borderColor: "rgba(255,255,255,0.08)",
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = "#a855f7"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.12)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                    required
                  />
                </div>

                <div className="space-y-2 sm:row-span-2">
                  <label className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Job Description <span style={{ color: "rgba(255,255,255,0.25)" }}>(optional)</span>
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description for better keyword matching..."
                    rows={5}
                    className="w-full rounded-xl border px-4 py-3 text-sm text-white outline-none resize-y transition-all duration-200"
                    style={{
                      background: "rgba(12,12,22,0.85)",
                      borderColor: "rgba(255,255,255,0.08)",
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = "#a855f7"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.12)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 flex items-start gap-2">
                  <CircleAlert className="size-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl px-5 py-3.5 text-sm font-bold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 hover:opacity-90 hover:scale-[1.01]"
                style={{ background: "linear-gradient(135deg, #a855f7, #6366f1 50%, #22c55e)" }}
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Analyzing your resume...
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Sparkles className="size-4" />
                    Analyze Resume
                  </span>
                )}
              </button>
            </form>

          ) : (
          /* ═══════════════ RESULT STATE ═══════════════ */
            <div className="fade-up fade-up-4 space-y-5">

              {/* ── Score + Keywords row ── */}
              <div
                className="rounded-2xl border p-6 sm:p-8"
                style={{ background: "rgba(12,12,22,0.85)", borderColor: "rgba(255,255,255,0.07)" }}
              >
                <div className="flex flex-col lg:flex-row gap-8">

                  {/* Score ring */}
                  <div className="flex flex-col items-center justify-center gap-4 lg:w-56 shrink-0">
                    <div className="relative" style={{ filter: `drop-shadow(0 0 28px ${theme.glowColor})` }}>
                      <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
                        <circle cx="100" cy="100" r={ring.r} fill="none" stroke={theme.trackStroke} strokeWidth="12" />
                        <circle
                          cx="100" cy="100" r={ring.r}
                          fill="none"
                          stroke={theme.stroke}
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={ring.circ}
                          strokeDashoffset={ring.offset}
                          className="ring-animate"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-5xl font-black leading-none text-white">{score}</p>
                        <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>ATS Score</p>
                        <span
                          className="mt-2 text-[10px] font-bold px-2.5 py-1 rounded-full"
                          style={{ background: theme.badgeBg, color: theme.badgeColor, border: `1px solid ${theme.badgeBorder}` }}
                        >
                          {theme.label}
                        </span>
                      </div>
                    </div>

                    {/* Analyzed for */}
                    <div className="text-center">
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Analyzed for</p>
                      <p className="text-sm font-semibold mt-0.5" style={{ color: "#c084fc" }}>{result._jobRole || jobRole}</p>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="flex-1 min-w-0 space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Matched */}
                      <div
                        className="rounded-xl border p-4"
                        style={{ background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.15)" }}
                      >
                        <h3 className="text-sm font-bold mb-3" style={{ color: "#4ade80" }}>
                          ✓ Matched Keywords ({result.matchedKeywords?.length ?? 0})
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {(result.matchedKeywords?.length
                            ? result.matchedKeywords
                            : ["No strong matches found"]
                          ).map((kw, i) => (
                            <span key={i} className="rounded-full px-2.5 py-1 text-xs"
                              style={{ background: "rgba(34,197,94,0.12)", color: "#86efac", border: "1px solid rgba(34,197,94,0.2)" }}>
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Missing */}
                      <div
                        className="rounded-xl border p-4"
                        style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.15)" }}
                      >
                        <h3 className="text-sm font-bold mb-3" style={{ color: "#f87171" }}>
                          ✗ Missing Keywords ({result.missingKeywords?.length ?? 0})
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {(result.missingKeywords?.length
                            ? result.missingKeywords
                            : ["No obvious gaps"]
                          ).map((kw, i) => (
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
                      <h3 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px" }}>
                        Section Feedback
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {sectionEntries.map((s, i) => (
                          <SectionCard key={s.key} label={s.label} value={s.value} index={i} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Strengths + Suggestions ── */}
              <div className="grid lg:grid-cols-2 gap-4">
                <div
                  className="rounded-2xl border p-5"
                  style={{ background: "rgba(34,197,94,0.05)", borderColor: "rgba(34,197,94,0.15)" }}
                >
                  <h3 className="font-bold text-base mb-4 inline-flex items-center gap-2" style={{ color: "#4ade80" }}>
                    <Sparkles className="size-4" /> Strengths
                  </h3>
                  <ul className="space-y-2.5">
                    {(result.strengths?.length ? result.strengths : ["No strengths generated."]).map((s, i) => (
                      <li key={i} className="flex gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                        <CheckCircle2 className="size-4 mt-0.5 shrink-0" style={{ color: "#4ade80" }} />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="rounded-2xl border p-5"
                  style={{ background: "rgba(168,85,247,0.05)", borderColor: "rgba(168,85,247,0.15)" }}
                >
                  <h3 className="font-bold text-base mb-4 inline-flex items-center gap-2" style={{ color: "#c084fc" }}>
                    <FileText className="size-4" /> Suggestions
                  </h3>
                  <ul className="space-y-2.5">
                    {(result.overallSuggestions?.length ? result.overallSuggestions : ["No suggestions generated."]).map((s, i) => (
                      <li key={i} className="flex gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                        <span className="mt-1.5 size-1.5 rounded-full shrink-0" style={{ background: "#a855f7" }} />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ── Action buttons ── */}
              <div
                className="rounded-2xl border p-5 flex flex-col sm:flex-row gap-3"
                style={{ background: "rgba(12,12,22,0.85)", borderColor: "rgba(255,255,255,0.07)" }}
              >
                <a
                  href={result.cloudinaryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
                  style={{ borderColor: "rgba(168,85,247,0.35)", color: "#c084fc", background: "rgba(168,85,247,0.08)" }}
                >
                  <ExternalLink className="size-4" />
                  View PDF
                </a>

                <button
                  type="button"
                  onClick={resetToForm}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
                  style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.04)" }}
                >
                  <RefreshCcw className="size-4" />
                  Analyze Another
                </button>

                <Link
                  to="/resume-history"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] sm:ml-auto"
                  style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)" }}
                >
                  View History
                </Link>
              </div>
            </div>
          )}

          {/* ── FOOTER NOTE — identical to Dashboard ── */}
          <p className="fade-up fade-up-5 text-center text-xs mt-12 sm:mt-16"
            style={{ color: "rgba(255,255,255,0.15)" }}>
            Lets make it big · CrackIt
          </p>
        </div>
      </div>
    </>
  );
}