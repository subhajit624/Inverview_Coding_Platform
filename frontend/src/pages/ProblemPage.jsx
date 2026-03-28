import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserButton } from "@clerk/react";
import { Code2, CheckCircle2, Clock, XCircle, Trophy, Search, Filter } from "lucide-react";
import problems from "../data/problems";
import axiosInstance from "../lib/axios";

const STYLES = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes countUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-up   { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both; }
.fade-up-1 { animation-delay: .04s; }
.fade-up-2 { animation-delay: .10s; }
.fade-up-3 { animation-delay: .18s; }
.fade-up-4 { animation-delay: .26s; }
.fade-up-5 { animation-delay: .32s; }
.shimmer-text {
  background: linear-gradient(90deg, #818cf8 0%, #34d399 40%, #818cf8 80%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
.stat-val { animation: countUp .5s cubic-bezier(.22,1,.36,1) both; animation-delay: .3s; }
.row-in { transition: background .15s ease; }
`;

const DIFF_CONFIG = {
  Easy:   { color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.25)"  },
  Medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)"  },
  Hard:   { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)" },
};

const FILTERS = ["All", "Easy", "Medium", "Hard", "Solved", "Unsolved"];

export default function ProblemList() {
  const [solvedIds,    setSolvedIds]    = useState(new Set());
  const [activeFilter, setActiveFilter] = useState("All");
  const [search,       setSearch]       = useState("");

  useEffect(() => {
    axiosInstance.get("/problems/my")
      .then(res => {
        const ids = new Set(res.data.solved.map(s => String(s.problemId)));
        setSolvedIds(ids);
      })
      .catch(err => console.error("Failed to fetch solved problems:", err));
  }, []);

  const easy   = problems.filter(p => p.difficulty === "Easy").length;
  const medium = problems.filter(p => p.difficulty === "Medium").length;
  const hard   = problems.filter(p => p.difficulty === "Hard").length;
  const solvedCount = problems.filter(p => solvedIds.has(String(p.id))).length;

  const filtered = problems.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (activeFilter === "All")     return true;
    if (activeFilter === "Solved")  return solvedIds.has(String(p.id));
    if (activeFilter === "Unsolved") return !solvedIds.has(String(p.id));
    return p.difficulty === activeFilter;
  });

  const stats = [
    { label: "Solved",  value: `${solvedCount}/${problems.length}`, color: "#818cf8", bg: "rgba(99,102,241,0.06)",   border: "rgba(99,102,241,0.2)",   icon: <CheckCircle2 className="size-3.5 sm:size-4" /> },
    { label: "Easy",    value: easy,   color: "#34d399", bg: "rgba(52,211,153,0.06)",  border: "rgba(52,211,153,0.2)",   icon: <CheckCircle2 className="size-3.5 sm:size-4" /> },
    { label: "Medium",  value: medium, color: "#f59e0b", bg: "rgba(245,158,11,0.06)",  border: "rgba(245,158,11,0.2)",   icon: <Clock className="size-3.5 sm:size-4" /> },
    { label: "Hard",    value: hard,   color: "#f87171", bg: "rgba(248,113,113,0.06)", border: "rgba(248,113,113,0.2)",  icon: <XCircle className="size-3.5 sm:size-4" /> },
  ];

  return (
    <>
      <style>{STYLES}</style>

      <div
        className="min-h-screen text-white overflow-x-hidden"
        style={{ background: "#08080f", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
      >
        {/* BG */}
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        <div className="fixed top-0 left-1/4 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", filter: "blur(70px)" }} />
        <div className="fixed bottom-1/3 right-0 w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)", filter: "blur(70px)" }} />

        {/* NAVBAR */}
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
              <Link to="/leaderboard"
                className="flex items-center gap-1.5 text-xs px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all duration-200"
                style={{ color: "rgba(255,255,255,0.45)", borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#f59e0b"; e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"; e.currentTarget.style.background = "rgba(245,158,11,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}>
                <Trophy className="size-3.5" />
                <span className="hidden sm:inline font-semibold">Leaderboard</span>
              </Link>
              <span className="hidden sm:inline text-xs px-2.5 py-1.5 rounded-lg"
                style={{ color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {problems.length} problems
              </span>
              <UserButton />
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

          {/* HEADER */}
          <div className="fade-up fade-up-1 mb-7 sm:mb-8">
            <h1 className="font-black tracking-tight mb-2" style={{ fontSize: "clamp(1.8rem,6vw,3rem)" }}>
              Problem{" "}
              <span className="shimmer-text">Set</span>
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>
              Solve problems, run your code, track your progress.
            </p>
          </div>

          {/* STATS */}
          <div className="fade-up fade-up-2 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
            {stats.map(({ label, value, color, bg, border, icon }) => (
              <div key={label} className="rounded-2xl border p-3 sm:p-4"
                style={{ background: bg, borderColor: border }}>
                <div className="flex items-center gap-1.5 mb-2" style={{ color }}>
                  {icon}
                  <span className="text-xs font-semibold">{label}</span>
                </div>
                <p className="stat-val text-xl sm:text-2xl font-black leading-none" style={{ color }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* SEARCH + FILTER ROW */}
          <div className="fade-up fade-up-3 flex flex-col sm:flex-row gap-3 mb-5">

            {/* Search */}
            <div className="flex items-center gap-2 flex-1 rounded-xl border px-3 py-2.5"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
              <Search className="size-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search problems..."
                className="bg-transparent text-sm outline-none flex-1 placeholder:text-zinc-600"
                style={{ color: "rgba(255,255,255,0.8)" }}
              />
              {search && (
                <button onClick={() => setSearch("")}
                  className="text-xs shrink-0 transition-colors duration-200"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
                  ✕
                </button>
              )}
            </div>

            {/* Filter pills — scrollable on mobile */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0"
              style={{ scrollbarWidth: "none" }}>
              <Filter className="size-3.5 shrink-0 ml-0.5" style={{ color: "rgba(255,255,255,0.25)" }} />
              {FILTERS.map(f => {
                const active = activeFilter === f;
                const fColor =
                  f === "Easy"    ? "#34d399" :
                  f === "Medium"  ? "#f59e0b" :
                  f === "Hard"    ? "#f87171" :
                  f === "Solved"  ? "#818cf8" :
                  f === "Unsolved"? "#94a3b8" : "rgba(255,255,255,0.7)";
                return (
                  <button key={f}
                    onClick={() => setActiveFilter(f)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all duration-200"
                    style={{
                      color:       active ? fColor : "rgba(255,255,255,0.4)",
                      borderColor: active ? fColor + "55" : "rgba(255,255,255,0.07)",
                      background:  active ? fColor + "12" : "rgba(255,255,255,0.03)",
                    }}>
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RESULTS COUNT */}
          {(search || activeFilter !== "All") && (
            <p className="fade-up text-xs mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
              {filtered.length} problem{filtered.length !== 1 ? "s" : ""} found
              {activeFilter !== "All" ? ` · ${activeFilter}` : ""}
              {search ? ` · "${search}"` : ""}
            </p>
          )}

          {/* TABLE */}
          <div className="fade-up fade-up-4 rounded-2xl border overflow-hidden"
            style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(12,12,22,0.8)" }}>

            {/* Header */}
            <div className="grid grid-cols-12 px-4 sm:px-6 py-3 border-b text-[10px] sm:text-xs font-semibold uppercase tracking-widest"
              style={{ borderColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.22)" }}>
              <div className="col-span-1">#</div>
              <div className="col-span-7 sm:col-span-8">Title</div>
              <div className="col-span-3 sm:col-span-2">Difficulty</div>
              <div className="col-span-1 text-center">✓</div>
            </div>

            {/* Empty */}
            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <Search className="size-10 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.08)" }} />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>No problems match your filter</p>
                <button onClick={() => { setSearch(""); setActiveFilter("All"); }}
                  className="text-xs mt-3 px-4 py-2 rounded-lg border transition-all duration-200"
                  style={{ color: "#818cf8", borderColor: "rgba(99,102,241,0.25)", background: "rgba(99,102,241,0.08)" }}>
                  Reset filters
                </button>
              </div>
            )}

            {/* Rows */}
            {filtered.map((p, idx) => {
              const diff   = DIFF_CONFIG[p.difficulty];
              const solved = solvedIds.has(String(p.id));
              const isLast = idx === filtered.length - 1;

              return (
                <div key={p.id}
                  className="row-in grid grid-cols-12 px-4 sm:px-6 py-3 sm:py-4 border-b items-center"
                  style={{
                    borderColor: "rgba(255,255,255,0.04)",
                    borderBottom: isLast ? "none" : "transparent",
                    background: "transparent",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = solved ? "rgba(52,211,153,0.03)" : "rgba(99,102,241,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Index */}
                  <div className="col-span-1 text-xs font-mono"
                    style={{ color: "rgba(255,255,255,0.18)" }}>
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  {/* Title */}
                  <div className="col-span-7 sm:col-span-8 min-w-0 pr-2">
                    <Link
                      to={`/problem/${p.id}`}
                      className="text-sm font-semibold transition-colors duration-200 block truncate"
                      style={{ color: solved ? "rgba(52,211,153,0.85)" : "rgba(255,255,255,0.8)" }}
                      onMouseEnter={e => e.currentTarget.style.color = solved ? "#34d399" : "#818cf8"}
                      onMouseLeave={e => e.currentTarget.style.color = solved ? "rgba(52,211,153,0.85)" : "rgba(255,255,255,0.8)"}
                    >
                      {p.title}
                    </Link>
                  </div>

                  {/* Difficulty */}
                  <div className="col-span-3 sm:col-span-2">
                    <span className="inline-flex text-[9px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full whitespace-nowrap"
                      style={{ color: diff.color, background: diff.bg, border: `1px solid ${diff.border}` }}>
                      {p.difficulty}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 flex justify-center">
                    {solved && (
                      <CheckCircle2 className="size-3.5 sm:size-4" style={{ color: "#34d399" }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <p className="text-center text-xs mt-8" style={{ color: "rgba(255,255,255,0.15)" }}>
            {solvedCount} of {problems.length} problems solved · keep going! 
          </p>
        </div>
      </div>
    </>
  );
}