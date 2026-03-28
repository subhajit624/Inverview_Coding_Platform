import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/react";
import { Code2, Trophy, Medal, ArrowLeft, Crown, Flame, Zap } from "lucide-react";
import axiosInstance from "../lib/axios";

const STYLES = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes pulse-dot {
  0%,100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.5; transform: scale(0.75); }
}
@keyframes bar-grow {
  from { width: 0%; }
  to   { width: var(--bar-w); }
}
.fade-up   { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both; }
.fade-up-1 { animation-delay: .04s; }
.fade-up-2 { animation-delay: .10s; }
.fade-up-3 { animation-delay: .16s; }
.fade-up-4 { animation-delay: .22s; }
.shimmer-gold {
  background: linear-gradient(90deg, #f59e0b 0%, #fde68a 40%, #f59e0b 80%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
}
.row-hover { transition: background .15s ease, transform .15s ease; }
.row-hover:hover { background: rgba(255,255,255,0.025) !important; }
.bar { animation: bar-grow .8s cubic-bezier(.22,1,.36,1) both; animation-delay: .4s; }
`;

const RANK_CONFIG = {
  1: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.28)",
    glow: "rgba(245,158,11,0.15)",
    icon: <Crown className="size-3.5 sm:size-4" style={{ color: "#f59e0b" }} />,
  },
  2: {
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.07)",
    border: "rgba(148,163,184,0.2)",
    glow: "rgba(148,163,184,0.08)",
    icon: <Medal className="size-3.5 sm:size-4" style={{ color: "#94a3b8" }} />,
  },
  3: {
    color: "#cd7c4f",
    bg: "rgba(205,124,79,0.08)",
    border: "rgba(205,124,79,0.2)",
    glow: "rgba(205,124,79,0.08)",
    icon: <Medal className="size-3.5 sm:size-4" style={{ color: "#cd7c4f" }} />,
  },
};

export default function Leaderboard() {
  const { user }                  = useUser();
  const [board,   setBoard]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error,   setError]       = useState(null);

  useEffect(() => {
    axiosInstance.get("/problems/leaderboard")
      .then(res => setBoard(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const myEntry = board.find(b => b.email === user?.primaryEmailAddress?.emailAddress);
  const maxSolved = board[0]?.solvedCount || 1;

  return (
    <>
      <style>{STYLES}</style>

      <div
        className="min-h-screen text-white overflow-x-hidden"
        style={{ background: "#08080f", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
      >
        {/* BG GRID */}
        <div className="fixed inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        <div className="fixed top-0 left-1/4 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)", filter: "blur(70px)" }} />
        <div className="fixed bottom-1/3 right-0 w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)", filter: "blur(70px)" }} />

        {/* NAVBAR */}
        <nav className="sticky top-0 z-50 border-b fade-up"
          style={{ background: "rgba(8,8,15,0.88)", backdropFilter: "blur(24px)", borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link to="/" className="flex items-center gap-2 shrink-0">
                <div className="size-8 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #6366f1, #22c55e)" }}>
                  <Code2 className="size-4 text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight hidden sm:block"
                  style={{ fontFamily: "'Courier New', monospace" }}>
                  Crack<span style={{ color: "#818cf8" }}>It</span>
                </span>
              </Link>

              <div className="hidden sm:block w-px h-4" style={{ background: "rgba(255,255,255,0.08)" }} />

              <Link to="/problems"
                className="hidden sm:flex items-center gap-1.5 text-xs transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.35)" }}
                onMouseEnter={e => e.currentTarget.style.color = "#818cf8"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>
                <ArrowLeft className="size-3.5" /> Problems
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "#f59e0b" }}>
                <Trophy className="size-4" />
                <span className="hidden sm:inline">Leaderboard</span>
              </div>
              <UserButton />
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

          {/* HEADER */}
          <div className="fade-up fade-up-1 mb-8 sm:mb-10 text-center">
            <div className="inline-flex items-center justify-center size-14 rounded-2xl mb-4 border"
              style={{
                background: "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(245,158,11,0.04))",
                borderColor: "rgba(245,158,11,0.2)",
                boxShadow: "0 0 40px rgba(245,158,11,0.12)",
              }}>
              <Trophy className="size-7" style={{ color: "#f59e0b" }} />
            </div>
            <h1 className="font-black tracking-tight mb-2" style={{ fontSize: "clamp(2rem,6vw,3rem)" }}>
              Leader<span className="shimmer-gold">board</span>
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Top coders ranked by problems solved
            </p>
          </div>

          {/* MY RANK BANNER */}
          {myEntry && (
            <div className="fade-up fade-up-2 mb-6 rounded-2xl p-4 sm:p-5 border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              style={{
                background: "rgba(99,102,241,0.07)",
                borderColor: "rgba(99,102,241,0.25)",
                boxShadow: "0 0 30px rgba(99,102,241,0.08)",
              }}>
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
                  <Flame className="size-4" style={{ color: "#818cf8" }} />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>Your ranking</p>
                  <p className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.75)" }}>
                    Keep solving to climb higher!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-black" style={{ color: "#818cf8" }}>#{myEntry.rank}</p>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>rank</p>
                </div>
                <div className="w-px h-8 hidden sm:block" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-black" style={{ color: "#34d399" }}>{myEntry.solvedCount}</p>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>solved</p>
                </div>
              </div>
            </div>
          )}

          {/* TOP 3 podium — mobile friendly */}
          {!loading && !error && board.length >= 3 && (
            <div className="fade-up fade-up-3 grid grid-cols-3 gap-2 sm:gap-3 mb-6">
              {[board[1], board[0], board[2]].map((entry, podiumIdx) => {
                if (!entry) return null;
                const actualRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
                const cfg        = RANK_CONFIG[actualRank];
                const heights    = ["h-20 sm:h-24", "h-28 sm:h-32", "h-16 sm:h-20"];
                const initials   = entry.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                const isMe       = entry.email === user?.primaryEmailAddress?.emailAddress;

                return (
                  <div key={entry.userId}
                    className={`flex flex-col items-center justify-end rounded-2xl border p-2 sm:p-3 ${heights[podiumIdx]}`}
                    style={{
                      background: cfg.bg,
                      borderColor: cfg.border,
                      boxShadow: podiumIdx === 1 ? `0 0 40px ${cfg.glow}` : "none",
                      order: podiumIdx === 1 ? -1 : "initial",
                    }}>
                    {/* Crown/icon */}
                    <div className="mb-1">{cfg.icon}</div>
                    {/* Avatar */}
                    <div className="size-7 sm:size-9 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black mb-1 shrink-0"
                      style={{
                        background: isMe ? "linear-gradient(135deg, #6366f1, #818cf8)" : `linear-gradient(135deg, ${cfg.color}55, ${cfg.color}22)`,
                        color: isMe ? "#fff" : cfg.color,
                        border: `1px solid ${cfg.border}`,
                      }}>
                      {initials}
                    </div>
                    <p className="text-[9px] sm:text-[11px] font-bold truncate max-w-full px-1"
                      style={{ color: cfg.color }}>
                      {entry.name.split(" ")[0]}
                    </p>
                    <p className="text-xs sm:text-sm font-black" style={{ color: cfg.color }}>
                      {entry.solvedCount}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* TABLE */}
          <div className="fade-up fade-up-4 rounded-2xl border overflow-hidden"
            style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(12,12,22,0.8)" }}>

            {/* Header */}
            <div className="grid grid-cols-12 px-4 sm:px-6 py-3 border-b text-[10px] sm:text-xs font-semibold uppercase tracking-widest"
              style={{ borderColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.25)" }}>
              <div className="col-span-2 sm:col-span-1">Rank</div>
              <div className="col-span-7 sm:col-span-8">User</div>
              <div className="col-span-3 text-right">Solved</div>
            </div>

            {/* States */}
            {loading && (
              <div className="py-16 sm:py-20 flex flex-col items-center gap-3">
                <div className="size-6 rounded-full border-2 animate-spin"
                  style={{ borderColor: "rgba(245,158,11,0.4)", borderTopColor: "transparent" }} />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>Loading...</p>
              </div>
            )}
            {error && (
              <div className="py-16 sm:py-20 text-center text-sm" style={{ color: "#f87171" }}>
                Failed to load leaderboard.
              </div>
            )}
            {!loading && !error && board.length === 0 && (
              <div className="py-16 sm:py-20 text-center">
                <Zap className="size-10 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.1)" }} />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
                  No data yet. Be the first to solve a problem!
                </p>
              </div>
            )}

            {/* Rows */}
            {!loading && !error && board.map((entry, i) => {
              const rankCfg  = RANK_CONFIG[entry.rank];
              const isMe     = entry.email === user?.primaryEmailAddress?.emailAddress;
              const initials = entry.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
              const barPct   = Math.round((entry.solvedCount / maxSolved) * 100);
              const isLast   = i === board.length - 1;

              return (
                <div key={entry.userId}
                  className="row-hover grid grid-cols-12 px-4 sm:px-6 py-3 sm:py-4 items-center"
                  style={{
                    borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
                    background: isMe
                      ? "rgba(99,102,241,0.06)"
                      : rankCfg
                      ? rankCfg.bg.replace("0.10", "0.04").replace("0.08", "0.03").replace("0.07", "0.03")
                      : "transparent",
                    boxShadow: isMe ? "inset 2px 0 0 #6366f1" : rankCfg ? `inset 2px 0 0 ${rankCfg.color}66` : "none",
                  }}
                >
                  {/* Rank badge */}
                  <div className="col-span-2 sm:col-span-1 flex items-center">
                    {rankCfg ? (
                      <div className="flex items-center justify-center size-7 sm:size-8 rounded-xl border"
                        style={{ background: rankCfg.bg, borderColor: rankCfg.border }}>
                        {rankCfg.icon}
                      </div>
                    ) : (
                      <span className="text-xs sm:text-sm font-bold font-mono pl-1"
                        style={{ color: "rgba(255,255,255,0.22)" }}>
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  {/* User */}
                  <div className="col-span-7 sm:col-span-8 flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="size-7 sm:size-9 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0"
                      style={{
                        background: isMe
                          ? "linear-gradient(135deg, #6366f1, #818cf8)"
                          : rankCfg
                          ? `linear-gradient(135deg, ${rankCfg.color}55, ${rankCfg.color}22)`
                          : "rgba(255,255,255,0.06)",
                        color:  isMe ? "#fff" : rankCfg ? rankCfg.color : "rgba(255,255,255,0.4)",
                        border: isMe
                          ? "1px solid rgba(99,102,241,0.4)"
                          : "1px solid rgba(255,255,255,0.07)",
                      }}>
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs sm:text-sm font-semibold truncate"
                          style={{ color: isMe ? "#818cf8" : "rgba(255,255,255,0.8)" }}>
                          {entry.name}
                        </span>
                        {isMe && (
                          <span className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-bold shrink-0"
                            style={{ color: "#818cf8", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Solved + progress bar */}
                  <div className="col-span-3 flex flex-col items-end gap-1.5">
                    <span className="text-sm sm:text-base font-black tabular-nums"
                      style={{ color: rankCfg ? rankCfg.color : "rgba(255,255,255,0.65)" }}>
                      {entry.solvedCount}
                    </span>
                    <div className="hidden sm:block h-1 w-20 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="bar h-full rounded-full"
                        style={{
                          "--bar-w": `${barPct}%`,
                          width: `${barPct}%`,
                          background: rankCfg
                            ? `linear-gradient(90deg, ${rankCfg.color}, ${rankCfg.color}88)`
                            : "linear-gradient(90deg, #818cf8, #6366f1)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <p className="text-center text-xs mt-10" style={{ color: "rgba(255,255,255,0.15)" }}>
            Lets make it big · CrackIt
          </p>
        </div>
      </div>
    </>
  );
}