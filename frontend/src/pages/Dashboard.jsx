import { Link } from "react-router-dom";
import { Code2, ArrowRight, BookOpen, Video, Zap, Trophy, Users, FileSearch } from "lucide-react";
import { UserButton, useUser } from "@clerk/react";
import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";

// ── tiny CSS injected once ─────────────────────────────────────────────────
const STYLES = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes pulse-ring {
  0%,100% { box-shadow: 0 0 0 0px rgba(99,102,241,0.25); }
  50%      { box-shadow: 0 0 0 8px rgba(99,102,241,0);   }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes float {
  0%,100% { transform: translateY(0);    }
  50%      { transform: translateY(-6px); }
}
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.fade-up         { animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both; }
.fade-up-1       { animation-delay: .05s; }
.fade-up-2       { animation-delay: .15s; }
.fade-up-3       { animation-delay: .25s; }
.fade-up-4       { animation-delay: .35s; }
.fade-up-5       { animation-delay: .42s; }
.card-hover      { transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
.card-hover:hover { transform: translateY(-4px) scale(1.008); }
.shimmer-text {
  background: linear-gradient(90deg, #818cf8 0%, #34d399 40%, #818cf8 80%, #34d399 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
`;

// ── stat card ──────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, label, value, color, bg, delay }) {
  return (
    <div
      className={`fade-up fade-up-${delay} flex items-center gap-3 rounded-2xl border px-4 py-3`}
      style={{ background: bg, borderColor: color.replace(")", ",0.25)").replace("rgb", "rgba") }}
    >
      <div className="size-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: color.replace(")", ",0.12)").replace("rgb", "rgba") }}>
        <Icon className="size-4" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-black leading-none" style={{ color }}>{value}</p>
        <p className="text-[11px] mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</p>
      </div>
    </div>
  );
}

// ── feature card ──────────────────────────────────────────────────────────
function FeatureCard({ to, icon: Icon, iconColor, iconBg, borderColor, title, desc, cta, ctaColor, delay, badge }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={to}
      className={`fade-up fade-up-${delay} card-hover relative group flex flex-col rounded-2xl border p-5 sm:p-6 overflow-hidden`}
      style={{
        background: "rgba(12,12,22,0.85)",
        borderColor: hovered ? borderColor : "rgba(255,255,255,0.07)",
        boxShadow: hovered ? `0 20px 60px ${borderColor}25, 0 0 0 1px ${borderColor}` : "none",
        textDecoration: "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ambient glow blob */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${borderColor}22 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Top row: icon + badge */}
      <div className="flex items-start justify-between mb-5">
        <div
          className="size-11 sm:size-12 rounded-xl flex items-center justify-center border shrink-0"
          style={{
            background: iconBg,
            borderColor: borderColor + "40",
            animation: hovered ? "pulse-ring 1.5s infinite" : "none",
          }}
        >
          <Icon className="size-5" style={{ color: iconColor }} />
        </div>
        {badge && (
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: `${borderColor}18`, color: iconColor, border: `1px solid ${borderColor}40` }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Text */}
      <h2 className="font-black text-base sm:text-lg leading-snug mb-2 text-white">{title}</h2>
      <p className="text-sm leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>

      {/* CTA */}
      <div className="mt-5 flex items-center gap-1.5 text-xs font-bold" style={{ color: ctaColor }}>
        {cta}
        <ArrowRight
          className="size-3.5 transition-transform duration-200 group-hover:translate-x-1"
        />
      </div>

      {/* Bottom shimmer line on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${borderColor}, transparent)`,
          opacity: hovered ? 1 : 0,
        }}
      />
    </Link>
  );
}

// ── main page ─────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useUser();
  const [solvedCount, setSolvedCount] = useState("—");

  useEffect(() => {
    axiosInstance.get("/problems/my")
      .then(res => setSolvedCount(res.data.solved?.length ?? 0))
      .catch(() => setSolvedCount("—"));
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" :
    hour < 17 ? "Good afternoon" :
    "Good evening";

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

        {/* Glow blobs */}
        <div className="fixed top-0 left-1/4 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", filter: "blur(70px)" }} />
        <div className="fixed bottom-0 right-1/4 w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)", filter: "blur(70px)" }} />
        <div className="fixed top-1/2 left-0 w-[280px] h-[280px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)", filter: "blur(60px)" }} />

        {/* ── NAVBAR ── */}
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

            {/* Nav links */}
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

          {/* ── HERO ── */}
          <div className="mb-10 sm:mb-12">

            {/* Greeting chip */}
            <div className="fade-up fade-up-1 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 mb-5"
              style={{ background: "rgba(99,102,241,0.07)", borderColor: "rgba(99,102,241,0.2)" }}>
              <div className="size-1.5 rounded-full" style={{ background: "#818cf8", animation: "float 2s ease-in-out infinite" }} />
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>
                {greeting}
              </span>
            </div>

            {/* Name */}
            <h1 className="fade-up fade-up-2 font-black tracking-tight leading-none mb-3"
              style={{ fontSize: "clamp(2.2rem, 7vw, 3.5rem)" }}>
              <span className="shimmer-text">
                {user?.firstName || "Coder"}
              </span>
              <span className="ml-2 sm:ml-3" style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)" }}>
                👋
              </span>
            </h1>

            <p className="fade-up fade-up-2 text-sm sm:text-base max-w-md"
              style={{ color: "rgba(255,255,255,0.38)", lineHeight: 1.7 }}>
              Your coding arena is ready. Pick a mode and get after it.
            </p>
          </div>

          {/* ── STATS ROW ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10 sm:mb-12">
            <StatPill
              icon={Zap}
              label="Problems Solved"
              value={solvedCount}
              color="rgb(129,140,248)"
              bg="rgba(99,102,241,0.06)"
              delay={3}
            />
            <StatPill
              icon={Trophy}
              label="Leaderboard"
              value="View"
              color="rgb(245,158,11)"
              bg="rgba(245,158,11,0.06)"
              delay={4}
            />
            <div className="col-span-2 sm:col-span-1">
              <StatPill
                icon={Users}
                label="Mock Sessions"
                value="Live"
                color="rgb(52,211,153)"
                bg="rgba(52,211,153,0.06)"
                delay={5}
              />
            </div>
          </div>

          {/* ── DIVIDER ── */}
          <div className="fade-up fade-up-3 flex items-center gap-4 mb-8">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: "rgba(255,255,255,0.2)" }}>
              Choose your mode
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
          </div>

          {/* ── FEATURE CARDS ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

            {/* Problems */}
            <FeatureCard
              to="/problems"
              icon={BookOpen}
              iconColor="#818cf8"
              iconBg="rgba(99,102,241,0.1)"
              borderColor="#6366f1"
              title="Problem Set"
              desc="50+ curated DSA problems across Easy, Medium, and Hard. Run code in Python, JavaScript, or Java with instant feedback."
              cta="Browse Problems"
              ctaColor="#818cf8"
              badge="55 Problems"
              delay={4}
            />

            {/* Live Interview */}
            <FeatureCard
              to="/interview-dashboard"
              icon={Video}
              iconColor="#4ade80"
              iconBg="rgba(34,197,94,0.1)"
              borderColor="#22c55e"
              title="Live Interview"
              desc="Practice 1-on-1 mock interviews with a peer. Shared code editor, real problems, and live HD video — all in one window."
              cta="Start Session"
              ctaColor="#4ade80"
              badge="Live"
              delay={5}
            />

            {/* Resume Analyzer */}
            <FeatureCard
              to="/resume-upload"
              icon={FileSearch}
              iconColor="#c084fc"
              iconBg="rgba(168,85,247,0.1)"
              borderColor="#a855f7"
              title="Resume Analyzer"
              desc="Upload your resume and get an ATS score, keyword match report, and section-by-section AI feedback tailored to your target role."
              cta="Analyze Resume"
              ctaColor="#c084fc"
              badge="AI Powered"
              delay={5}
            />

            {/* Leaderboard — full width on mobile */}
            <Link
              to="/leaderboard"
              className="fade-up fade-up-5 card-hover group sm:col-span-2 relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 rounded-2xl border p-5 sm:p-6 overflow-hidden"
              style={{
                background: "rgba(12,12,22,0.85)",
                borderColor: "rgba(245,158,11,0.15)",
                textDecoration: "none",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#f59e0b";
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(245,158,11,0.15), 0 0 0 1px #f59e0b";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(245,158,11,0.15)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Ambient blob */}
              <div className="absolute -right-12 top-0 bottom-0 w-48 pointer-events-none"
                style={{ background: "radial-gradient(circle at right, rgba(245,158,11,0.06) 0%, transparent 70%)" }} />

              <div className="size-11 sm:size-14 rounded-xl flex items-center justify-center border shrink-0"
                style={{ background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.25)" }}>
                <Trophy className="size-5 sm:size-6" style={{ color: "#f59e0b" }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="font-black text-base sm:text-lg text-white">Leaderboard</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)" }}>
                    Rankings
                  </span>
                </div>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.38)" }}>
                  See where you stand. 
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold shrink-0" style={{ color: "#f59e0b" }}>
                View Rankings
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>

              {/* Bottom line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, #f59e0b44, transparent)" }} />
            </Link>
          </div>

          {/* ── FOOTER NOTE ── */}
          <p className="fade-up fade-up-5 text-center text-xs mt-12 sm:mt-16"
            style={{ color: "rgba(255,255,255,0.15)" }}>
            Lets make it big · CrackIt
          </p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;