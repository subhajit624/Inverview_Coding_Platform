import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/react";
import { Code2, Trophy, Medal, ArrowLeft, Crown, Flame } from "lucide-react";
import axiosInstance from "../lib/axios";

const RANK_CONFIG = {
  1: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", icon: <Crown className="size-4" style={{ color: "#f59e0b" }} /> },
  2: { color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)", icon: <Medal className="size-4" style={{ color: "#94a3b8" }} /> },
  3: { color: "#cd7c4f", bg: "rgba(205,124,79,0.08)", border: "rgba(205,124,79,0.2)", icon: <Medal className="size-4" style={{ color: "#cd7c4f" }} /> },
};

export default function Leaderboard() {
  const { user } = useUser();
  const [board, setBoard]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    axiosInstance.get("/problems/leaderboard")
      .then(res => setBoard(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // find current user's rank for the highlight banner
  const myEntry = board.find(b => b.email === user?.primaryEmailAddress?.emailAddress);

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
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="fixed bottom-1/3 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />

      {/* NAVBAR */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{ background: "rgba(8,8,15,0.85)", backdropFilter: "blur(24px)", borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6366f1, #22c55e)" }}>
                <Code2 className="size-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight hidden sm:block"
                style={{ fontFamily: "'Courier New', monospace" }}>
                Crack<span style={{ color: "#818cf8" }}>It</span>
              </span>
            </Link>

            <div className="hidden sm:block" style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.08)" }} />

            <Link to="/problems"
              className="hidden sm:flex items-center gap-1.5 text-xs transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.35)" }}
              onMouseEnter={e => e.currentTarget.style.color = "#818cf8"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>
              <ArrowLeft className="size-3.5" /> Problems
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#f59e0b" }}>
              <Trophy className="size-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </div>
            <UserButton />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))", border: "1px solid rgba(245,158,11,0.2)" }}>
            <Trophy className="size-7" style={{ color: "#f59e0b" }} />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Leader
            <span style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #f87171 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              board
            </span>
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            Top coders ranked by problems solved
          </p>
        </div>

        {/* MY RANK BANNER — only shown if user is in the list */}
        {myEntry && (
          <div className="mb-8 rounded-2xl p-4 border flex items-center justify-between"
            style={{ background: "rgba(99,102,241,0.07)", borderColor: "rgba(99,102,241,0.25)" }}>
            <div className="flex items-center gap-3">
              <Flame className="size-5" style={{ color: "#818cf8" }} />
              <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                Your rank
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black" style={{ color: "#818cf8" }}>
                #{myEntry.rank}
              </span>
              <span className="text-sm font-bold px-3 py-1 rounded-full"
                style={{ color: "#34d399", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)" }}>
                {myEntry.solvedCount} solved
              </span>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="rounded-2xl border overflow-hidden"
          style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(12,12,22,0.8)" }}>

          {/* Header row */}
          <div className="grid grid-cols-12 px-6 py-3 border-b text-xs font-semibold uppercase tracking-widest"
            style={{ borderColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.25)" }}>
            <div className="col-span-1">Rank</div>
            <div className="col-span-7">User</div>
            <div className="col-span-4 text-right">Solved</div>
          </div>

          {/* States */}
          {loading && (
            <div className="py-20 text-center text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
              Loading...
            </div>
          )}
          {error && (
            <div className="py-20 text-center text-sm" style={{ color: "#f87171" }}>
              Failed to load leaderboard.
            </div>
          )}
          {!loading && !error && board.length === 0 && (
            <div className="py-20 text-center text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
              No data yet. Be the first to solve a problem!
            </div>
          )}

          {/* Rows */}
          {!loading && !error && board.map((entry) => {
            const rankCfg   = RANK_CONFIG[entry.rank];
            const isMe      = entry.email === user?.primaryEmailAddress?.emailAddress;
            const initials  = entry.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

            return (
              <div
                key={entry.userId}
                className="grid grid-cols-12 px-6 py-4 border-b items-center transition-all duration-200"
                style={{
                  borderColor: isMe ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                  background: isMe
                    ? "rgba(99,102,241,0.06)"
                    : rankCfg
                    ? rankCfg.bg.replace("0.12", "0.04").replace("0.08", "0.03")
                    : "transparent",
                }}
                onMouseEnter={e => !isMe && (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={e => !isMe && (e.currentTarget.style.background = rankCfg ? rankCfg.bg.replace("0.12","0.04").replace("0.08","0.03") : "transparent")}
              >
                {/* Rank */}
                <div className="col-span-1 flex items-center">
                  {rankCfg ? (
                    <div className="flex items-center justify-center size-8 rounded-xl"
                      style={{ background: rankCfg.bg, border: `1px solid ${rankCfg.border}` }}>
                      {rankCfg.icon}
                    </div>
                  ) : (
                    <span className="text-sm font-bold font-mono pl-1"
                      style={{ color: "rgba(255,255,255,0.25)" }}>
                      {entry.rank}
                    </span>
                  )}
                </div>

                {/* User */}
                <div className="col-span-7 flex items-center gap-3">
                  {/* Avatar */}
                  <div className="size-8 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                    style={{
                      background: isMe
                        ? "linear-gradient(135deg, #6366f1, #818cf8)"
                        : rankCfg
                        ? `linear-gradient(135deg, ${rankCfg.color}55, ${rankCfg.color}22)`
                        : "rgba(255,255,255,0.06)",
                      color: isMe ? "#fff" : rankCfg ? rankCfg.color : "rgba(255,255,255,0.4)",
                      border: isMe ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.07)",
                    }}>
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate"
                        style={{ color: isMe ? "#818cf8" : "rgba(255,255,255,0.8)" }}>
                        {entry.name}
                      </span>
                      {isMe && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold shrink-0"
                          style={{ color: "#818cf8", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-xs truncate mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {entry.email}
                    </p>
                  </div>
                </div>

                {/* Solved Count */}
                <div className="col-span-4 flex items-center justify-end gap-3">
                  {/* Mini bar */}
                  {board[0]?.solvedCount > 0 && (
                    <div className="hidden sm:block h-1.5 w-24 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(entry.solvedCount / board[0].solvedCount) * 100}%`,
                          background: rankCfg
                            ? `linear-gradient(90deg, ${rankCfg.color}, ${rankCfg.color}88)`
                            : "linear-gradient(90deg, #818cf8, #6366f1)",
                        }}
                      />
                    </div>
                  )}
                  <span className="text-sm font-black tabular-nums"
                    style={{ color: rankCfg ? rankCfg.color : "rgba(255,255,255,0.7)", minWidth: "2ch", textAlign: "right" }}>
                    {entry.solvedCount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}