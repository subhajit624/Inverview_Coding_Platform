import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserButton } from "@clerk/react";
import { Code2, CheckCircle2, Clock, XCircle, Trophy } from "lucide-react";
import problems from "../data/problems";
import axiosInstance from "../lib/axios";

const DIFF_CONFIG = {
  Easy: { color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.25)" },
  Medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)" },
  Hard: { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)" },
};

export default function ProblemList() {
  const easy = problems.filter((p) => p.difficulty === "Easy").length;
  const medium = problems.filter((p) => p.difficulty === "Medium").length;
  const hard = problems.filter((p) => p.difficulty === "Hard").length;

  // ── SOLVED STATE ──────────────────────────────────────────────────────────
  const [solvedIds, setSolvedIds] = useState(new Set());

  useEffect(() => {
    axiosInstance
      .get("/problems/my")
      .then((res) => {
        const ids = new Set(res.data.solved.map((s) => String(s.problemId)));
        setSolvedIds(ids);
      })
      .catch((err) => console.error("Failed to fetch solved problems:", err));
  }, []);
  // ──────────────────────────────────────────────────────────────────────────

  const solvedCount = problems.filter((p) => solvedIds.has(String(p.id))).length;

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#08080f", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      {/* BG GRID */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* GLOW BLOBS */}
      <div
        className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="fixed bottom-1/3 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* NAVBAR */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(8,8,15,0.85)",
          backdropFilter: "blur(24px)",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div
              className="size-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #22c55e)" }}
            >
              <Code2 className="size-4 text-white" />
            </div>
            <span
              className="font-bold text-lg tracking-tight"
              style={{ fontFamily: "'Courier New', monospace" }}
            >
              Crack<span style={{ color: "#818cf8" }}>It</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* LEADERBOARD BUTTON */}
            <Link
              to="/leaderboard"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200"
              style={{
                color: "rgba(255,255,255,0.45)",
                borderColor: "rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#f59e0b";
                e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)";
                e.currentTarget.style.background = "rgba(245,158,11,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              <Trophy className="size-3.5" />
              <span className="hidden sm:inline font-semibold">Leaderboard</span>
            </Link>

            <span className="hidden sm:inline text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              {problems.length} Problems
            </span>
            <UserButton />
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
            Problem{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #818cf8 0%, #34d399 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Set
            </span>
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Solve problems, run your code, and track your progress.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {/* SOLVED STAT */}
          <div
            className="rounded-2xl p-3 sm:p-5 border min-w-0"
            style={{ background: "rgba(99,102,241,0.06)", borderColor: "rgba(99,102,241,0.2)" }}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1" style={{ color: "#818cf8" }}>
              <CheckCircle2 className="size-3.5 sm:size-4" />
              <span className="text-xs sm:text-sm font-semibold">Solved</span>
            </div>
            <p className="text-xl sm:text-3xl font-black leading-none" style={{ color: "#818cf8" }}>
              {solvedCount}
              <span
                className="text-xs sm:text-base font-normal ml-1"
                style={{ color: "rgba(129,140,248,0.5)" }}
              >
                /{problems.length}
              </span>
            </p>
          </div>

          {[
            {
              label: "Easy",
              count: easy,
              color: "#34d399",
              bg: "rgba(52,211,153,0.08)",
              border: "rgba(52,211,153,0.2)",
              icon: <CheckCircle2 className="size-3.5 sm:size-4" />,
            },
            {
              label: "Medium",
              count: medium,
              color: "#f59e0b",
              bg: "rgba(245,158,11,0.08)",
              border: "rgba(245,158,11,0.2)",
              icon: <Clock className="size-3.5 sm:size-4" />,
            },
            {
              label: "Hard",
              count: hard,
              color: "#f87171",
              bg: "rgba(248,113,113,0.08)",
              border: "rgba(248,113,113,0.2)",
              icon: <XCircle className="size-3.5 sm:size-4" />,
            },
          ].map(({ label, count, color, bg, border, icon }) => (
            <div
              key={label}
              className="rounded-2xl p-3 sm:p-5 border min-w-0"
              style={{ background: bg, borderColor: border }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1" style={{ color }}>
                {icon}
                <span className="text-xs sm:text-sm font-semibold">{label}</span>
              </div>
              <p className="text-xl sm:text-3xl font-black leading-none" style={{ color }}>
                {count}
              </p>
            </div>
          ))}
        </div>

        {/* Problem Table */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(12,12,22,0.8)" }}
        >
          {/* Table Header */}
          <div
            className="grid grid-cols-12 px-4 sm:px-6 py-3 border-b text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.25)" }}
          >
            <div className="col-span-1">#</div>
            <div className="col-span-7">Title</div>
            <div className="col-span-3">Difficulty</div>
            <div className="col-span-1">Status</div>
          </div>

          {/* Rows */}
          {problems.map((p, idx) => {
            const diff = DIFF_CONFIG[p.difficulty];
            const solved = solvedIds.has(String(p.id));

            return (
              <div
                key={p.id}
                className="grid grid-cols-12 px-4 sm:px-6 py-4 border-b items-center group transition-all duration-200"
                style={{
                  borderColor: "rgba(255,255,255,0.04)",
                  background: "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = solved
                    ? "rgba(52,211,153,0.03)"
                    : "rgba(99,102,241,0.04)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {/* Index */}
                <div className="col-span-1 text-sm font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {String(idx + 1).padStart(2, "0")}
                </div>

                {/* Title */}
                <div className="col-span-7 min-w-0 pr-2">
                  <Link
                    to={`/problem/${p.id}`}
                    className="text-sm font-semibold transition-colors duration-200 block truncate sm:whitespace-normal"
                    style={{
                      color: solved ? "rgba(52,211,153,0.85)" : "rgba(255,255,255,0.8)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = solved ? "#34d399" : "#818cf8")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = solved ? "rgba(52,211,153,0.85)" : "rgba(255,255,255,0.8)")
                    }
                  >
                    {p.title}
                  </Link>
                </div>

                {/* Difficulty Badge */}
                <div className="col-span-3">
                  <span
                    className="inline-flex text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap"
                    style={{
                      color: diff.color,
                      background: diff.bg,
                      border: `1px solid ${diff.border}`,
                    }}
                  >
                    {p.difficulty}
                  </span>
                </div>

                {/* STATUS COLUMN */}
                <div className="col-span-1 flex justify-center">
                  {solved && (
                    <CheckCircle2 className="size-4" style={{ color: "#34d399" }} title="Solved" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}