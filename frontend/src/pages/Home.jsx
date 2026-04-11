import { SignInButton } from "@clerk/react";
import { Link } from "react-router-dom";
import {
  Code2,
  Video,
  Zap,
  ArrowRight,
  CheckCircle2,
  Shield,
  BrainCircuit,
  FileSearch,
  Sparkles,
  ChevronRight,
  BookOpen,
  MessageSquareText,
} from "lucide-react";

const FEATURES = [
  {
    icon: <BrainCircuit className="size-6" />,
    title: "AI Interviewer",
    desc: "Practice with an AI that asks real DSA and system design questions, evaluates your answers, and gives detailed feedback — just like a real interview.",
    color: "text-violet-400",
    border: "rgba(139,92,246,0.3)",
    glow: "rgba(139,92,246,0.07)",
    glowHover: "rgba(139,92,246,0.14)",
    tag: "AI Powered",
    tagColor: "rgba(139,92,246,0.18)",
    tagText: "#c4b5fd",
    accent: "#8b5cf6",
  },
  {
    icon: <FileSearch className="size-6" />,
    title: "Resume Analyzer",
    desc: "Upload your resume and get instant AI-driven analysis — skill gaps, keyword suggestions, ATS compatibility score, and role-fit recommendations.",
    color: "text-cyan-400",
    border: "rgba(34,211,238,0.3)",
    glow: "rgba(34,211,238,0.06)",
    glowHover: "rgba(34,211,238,0.12)",
    tag: "AI Powered",
    tagColor: "rgba(34,211,238,0.15)",
    tagText: "#67e8f9",
    accent: "#22d3ee",
  },
  {
    icon: <Video className="size-6" />,
    title: "HD Video Calls",
    desc: "Crystal-clear video and audio for seamless communication. No downloads needed — works entirely in your browser with peer mock interviews.",
    color: "text-emerald-400",
    border: "rgba(52,211,153,0.3)",
    glow: "rgba(52,211,153,0.06)",
    glowHover: "rgba(52,211,153,0.12)",
    tag: "Real-time",
    tagColor: "rgba(52,211,153,0.15)",
    tagText: "#6ee7b7",
    accent: "#34d399",
  },
  {
    icon: <Code2 className="size-6" />,
    title: "Live Code Editor",
    desc: "Collaborate in a shared editor with syntax highlighting, multiple language support, and real-time cursor tracking during mock sessions.",
    color: "text-orange-400",
    border: "rgba(251,146,60,0.3)",
    glow: "rgba(251,146,60,0.06)",
    glowHover: "rgba(251,146,60,0.12)",
    tag: "Collaborative",
    tagColor: "rgba(251,146,60,0.15)",
    tagText: "#fdba74",
    accent: "#fb923c",
  },
  {
    icon: <MessageSquareText className="size-6" />,
    title: "Ask your Notes",
    desc: "Upload your study notes or paste content and chat with an AI that answers questions, explains concepts, and generates practice MCQs from your material.",
    color: "text-pink-400",
    border: "rgba(244,114,182,0.3)",
    glow: "rgba(244,114,182,0.06)",
    glowHover: "rgba(244,114,182,0.12)",
    tag: "Smart Study",
    tagColor: "rgba(244,114,182,0.15)",
    tagText: "#f9a8d4",
    accent: "#f472b6",
  },
  {
    icon: <Shield className="size-6" />,
    title: "Secure & Private",
    desc: "End-to-end encrypted sessions ensure your code, resume, and conversations remain completely private and protected at all times.",
    color: "text-yellow-400",
    border: "rgba(250,204,21,0.3)",
    glow: "rgba(250,204,21,0.06)",
    glowHover: "rgba(250,204,21,0.12)",
    tag: "Encrypted",
    tagColor: "rgba(250,204,21,0.15)",
    tagText: "#fde047",
    accent: "#facc15",
  },
];

const CODE_LINES = [
  { txt: "function twoSum(nums, target) {", color: "#93c5fd" },
  { txt: "  const map = new Map();", color: "#e2e8f0" },
  { txt: "  for (let i = 0; i < nums.length; i++) {", color: "#c4b5fd" },
  { txt: "    const comp = target - nums[i];", color: "#e2e8f0" },
  { txt: "    if (map.has(comp)) {", color: "#6ee7b7" },
  { txt: "      return [map.get(comp), i];", color: "#fdba74" },
  { txt: "    }", color: "#94a3b8" },
  { txt: "    map.set(nums[i], i);", color: "#e2e8f0" },
  { txt: "  }", color: "#94a3b8" },
  { txt: "}", color: "#93c5fd" },
];

const STATS = [
  { value: "Unlimited", label: "Practice Sessions" },
  { value: "Smooth", label: "User Experience" },
  { value: "3", label: "Languages supported" },
  { value: "24/7", label: "AI Availability" },
];

export default function Home() {
  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        background: "#08080f",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 0.3; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(38px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(38px) rotate(-360deg); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(99,102,241,0.25); }
          50% { box-shadow: 0 0 60px rgba(99,102,241,0.5), 0 0 100px rgba(99,102,241,0.2); }
        }
        .float { animation: float 6s ease-in-out infinite; }
        .float-delay { animation: float 6s ease-in-out infinite 1.5s; }
        .shimmer-text {
          background: linear-gradient(90deg, #818cf8 0%, #34d399 30%, #f472b6 60%, #818cf8 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .fade-up { animation: fadeUp 0.8s ease both; }
        .fade-up-1 { animation: fadeUp 0.8s ease 0.1s both; }
        .fade-up-2 { animation: fadeUp 0.8s ease 0.2s both; }
        .fade-up-3 { animation: fadeUp 0.8s ease 0.3s both; }
        .glow-btn { animation: glow-pulse 3s ease-in-out infinite; }
        .feature-card:hover .card-arrow { opacity: 1; transform: translateX(0); }
        .card-arrow { opacity: 0; transform: translateX(-4px); transition: all 0.25s; }
        .cursor-blink { animation: blink 1s step-end infinite; }
        .noise {
          position: fixed; inset: 0; pointer-events: none; z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: 0.35;
        }
        .notes-chat { animation: fadeUp 0.5s ease both; }
        .stat-card:hover { transform: translateY(-2px); }
        .stat-card { transition: transform 0.2s; }
      `}</style>

      {/* Noise texture overlay */}
      <div className="noise" />

      {/* BG GRID */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.035) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          zIndex: 0,
        }}
      />

      {/* AMBIENT GLOWS */}
      <div className="fixed top-[-10%] left-1/4 w-[700px] h-[700px] rounded-full pointer-events-none" style={{ zIndex: 0,
        background: "radial-gradient(circle, rgba(99,102,241,0.11) 0%, transparent 65%)", filter: "blur(70px)" }} />
      <div className="fixed top-1/2 right-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ zIndex: 0,
        background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 65%)", filter: "blur(80px)" }} />
      <div className="fixed bottom-0 left-1/3 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ zIndex: 0,
        background: "radial-gradient(circle, rgba(244,114,182,0.06) 0%, transparent 65%)", filter: "blur(80px)" }} />

      {/* NAVBAR */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(8,8,15,0.8)",
          backdropFilter: "blur(32px)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="size-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ background: "linear-gradient(135deg, #6366f1, #22c55e)", boxShadow: "0 0 16px rgba(99,102,241,0.4)" }}
            >
              <Code2 className="size-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Courier New', monospace" }}>
              Crack<span style={{ color: "#818cf8" }}>It</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border"
              style={{ background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.2)", color: "#4ade80" }}>
              <span className="size-1.5 rounded-full bg-green-400 inline-block" style={{ animation: "pulse-ring 2s infinite" }} />
              &nbsp;Live sessions active
            </div>
            <SignInButton mode="modal">
              <button
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "0 0 24px rgba(99,102,241,0.4)",
                }}
              >
                Sign In <ArrowRight className="size-3.5" />
              </button>
            </SignInButton>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative max-w-6xl mx-auto px-6 pt-28 pb-20" style={{ zIndex: 2 }}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="space-y-8">
            <div className="fade-up">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  borderColor: "rgba(99,102,241,0.3)",
                  color: "#a5b4fc",
                  boxShadow: "0 0 20px rgba(99,102,241,0.1)",
                }}
              >
                <Sparkles className="size-3" />
                AI-Powered Interview Platform
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: "rgba(99,102,241,0.25)", color: "#c4b5fd" }}>NEW</span>
              </div>
            </div>

            <div className="fade-up-1 space-y-2">
              <h1 className="text-5xl lg:text-[3.8rem] font-black leading-[1.08] tracking-tight">
                Code Together,
              </h1>
              <h1 className="text-5xl lg:text-[3.8rem] font-black leading-[1.08] tracking-tight shimmer-text">
                Win Together.
              </h1>
            </div>

            <p className="fade-up-2 text-base leading-relaxed max-w-md" style={{ color: "rgba(255,255,255,0.48)" }}>
              Practice with an AI interviewer, get your resume analyzed, chat with your notes, and collaborate with real engineers — all in one powerful platform.
            </p>

            <ul className="fade-up-3 space-y-3">
              {[
                { text: "AI interviewer with real-time feedback", color: "#34d399" },
                { text: "Resume analysis with ATS scoring", color: "#818cf8" },
                { text: "Chat with your study notes using AI", color: "#f472b6" },
              ].map(({ text, color }) => (
                <li key={text} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                  <CheckCircle2 className="size-4 shrink-0" style={{ color }} />
                  {text}
                </li>
              ))}
            </ul>

            <div className="fade-up-3 flex flex-wrap gap-4 pt-2">
              <SignInButton mode="modal">
                <button
                  className="glow-btn flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #6366f1, #34d399)" }}
                >
                  Get Started Free <ArrowRight className="size-4" />
                </button>
              </SignInButton>
            </div>
          </div>

          {/* RIGHT — code editor mock */}
          <div className="float" style={{ position: "relative" }}>
            {/* Decorative ring */}
            <div className="absolute -inset-4 rounded-3xl pointer-events-none" style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(34,211,153,0.08), rgba(244,114,182,0.08))",
              filter: "blur(1px)",
            }} />
            <div
              className="relative rounded-2xl overflow-hidden border"
              style={{
                background: "rgba(10,10,20,0.97)",
                borderColor: "rgba(255,255,255,0.08)",
                boxShadow: "0 0 100px rgba(99,102,241,0.15), 0 40px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {/* Title bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b"
                style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full" style={{ background: "#ef4444", boxShadow: "0 0 6px #ef444488" }} />
                  <div className="size-3 rounded-full" style={{ background: "#f59e0b", boxShadow: "0 0 6px #f59e0b88" }} />
                  <div className="size-3 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e88" }} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>twoSum.js</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold"
                  style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}>
                  <span className="size-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                  Live Session
                </div>
              </div>

              {/* Scanline effect */}
              <div className="absolute left-0 right-0 h-8 pointer-events-none" style={{
                background: "linear-gradient(to bottom, transparent, rgba(99,102,241,0.04), transparent)",
                animation: "scanline 4s linear infinite",
                zIndex: 5,
              }} />

              {/* Code lines */}
              <div className="p-5 font-mono text-sm leading-[1.9]">
                {CODE_LINES.map((line, i) => (
                  <div key={i} style={{ color: line.color }}>
                    <span style={{ color: "rgba(255,255,255,0.12)", userSelect: "none", marginRight: "16px", fontSize: "10px" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {line.txt}
                    {i === CODE_LINES.length - 1 && (
                      <span className="cursor-blink" style={{ color: "#818cf8", borderLeft: "2px solid #818cf8", marginLeft: "2px" }}>&nbsp;</span>
                    )}
                  </div>
                ))}
              </div>

              {/* AI feedback strip */}
              <div
                className="mx-4 mb-4 rounded-xl p-3.5 border flex items-start gap-3"
                style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(99,102,241,0.06))",
                  borderColor: "rgba(139,92,246,0.25)",
                  boxShadow: "0 0 30px rgba(139,92,246,0.08)",
                }}
              >
                <div className="size-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)" }}>
                  <BrainCircuit className="size-3.5" style={{ color: "#a78bfa" }} />
                </div>
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: "#a78bfa" }}>AI Interviewer</p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Great use of HashMap! Time complexity O(n). Can you solve it in O(1) space?
                  </p>
                </div>
              </div>

              {/* Footer bar */}
              <div className="flex items-center justify-between px-5 py-2.5 border-t text-xs font-mono"
                style={{
                  background: "rgba(99,102,241,0.05)",
                  borderColor: "rgba(99,102,241,0.15)",
                  color: "rgba(255,255,255,0.3)",
                }}>
                <span>JavaScript</span>
                <div className="flex items-center gap-4">
                  <span style={{ color: "#4ade80" }}>✓ 3/3 tests passed</span>
                  <span>2 participants</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="stat-card rounded-2xl p-5 border text-center"
              style={{
                background: "rgba(255,255,255,0.02)",
                borderColor: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(12px)",
              }}
            >
              <p className="text-2xl font-black mb-1" style={{
                background: "linear-gradient(135deg, #818cf8, #34d399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>{value}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative max-w-6xl mx-auto px-6 py-24" style={{ zIndex: 2 }}>
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border"
            style={{ background: "rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.25)", color: "#818cf8",
              boxShadow: "0 0 20px rgba(99,102,241,0.08)" }}>
            <Zap className="size-3" /> Everything in one platform
          </div>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight">
            Built for{" "}
            <span style={{
              background: "linear-gradient(135deg, #818cf8 0%, #34d399 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>serious engineers</span>
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.38)" }}>
            From AI-driven practice to live collaborative interviews and smart notes — every tool you need, zero context switching.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon, title, desc, color, border, glow, glowHover, tag, tagColor, tagText, accent }) => (
            <div
              key={title}
              className="feature-card rounded-2xl p-6 border group hover:-translate-y-1.5 transition-all duration-300 cursor-default relative overflow-hidden"
              style={{
                background: "rgba(10,10,20,0.9)",
                borderColor: border,
                boxShadow: `0 0 0 0 ${glow}`,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = `0 12px 40px ${glowHover}, 0 0 60px ${glow}`;
                e.currentTarget.style.borderColor = accent + "55";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = border;
              }}
            >
              {/* Gradient corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at top right, ${glow.replace("0.07", "0.3")}, transparent 70%)`,
                }} />

              <div className="relative space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`${color} size-12 rounded-xl flex items-center justify-center border relative`}
                    style={{ background: glow, borderColor: border }}>
                    {icon}
                    {/* Subtle shine */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08), transparent)" }} />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                    style={{ background: tagColor, color: tagText, borderColor: tagText + "30" }}>
                    {tag}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-[15px] mb-2">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>{desc}</p>
                </div>
                <div className={`card-arrow flex items-center gap-1 text-xs font-semibold ${color}`}>
                  Explore feature <ChevronRight className="size-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS + CTA */}
      <section className="relative max-w-6xl mx-auto px-6 py-8 mb-16" style={{ zIndex: 2 }}>
        <div
          className="rounded-3xl p-12 border relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(34,211,153,0.04) 50%, rgba(244,114,182,0.04) 100%)",
            borderColor: "rgba(99,102,241,0.22)",
            boxShadow: "0 0 80px rgba(99,102,241,0.06)",
          }}
        >
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(34,211,153,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />

          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight">
                Ready to land your
                <br />
                <span style={{
                  background: "linear-gradient(135deg, #818cf8, #34d399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  dream job?
                </span>
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>
                Sign up in seconds. No credit card needed. Start practicing with AI, get your resume scored, chat with your notes, and collaborate with real engineers today.
              </p>
              <SignInButton mode="modal">
                <button
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #34d399)",
                    boxShadow: "0 0 40px rgba(99,102,241,0.3)",
                  }}
                >
                  Start for Free <ArrowRight className="size-4" />
                </button>
              </SignInButton>
            </div>

            <div className="space-y-5">
              {[
                { num: "01", title: "Create your account", desc: "Sign up instantly with Google or email — no setup required.", color: "#818cf8" },
                { num: "02", title: "Analyze your resume", desc: "Upload your resume and get AI-powered feedback in seconds.", color: "#34d399" },
                { num: "03", title: "Ask your notes", desc: "Chat with your study material and generate practice questions.", color: "#f472b6" },
                { num: "04", title: "Practice & collaborate", desc: "Start an AI interview or invite a real partner to code live.", color: "#fdba74" },
              ].map(({ num, title, desc, color }) => (
                <div key={num} className="flex items-start gap-4 group">
                  <div
                    className="shrink-0 size-8 rounded-lg flex items-center justify-center text-xs font-black font-mono mt-0.5 border transition-colors duration-200"
                    style={{
                      color,
                      borderColor: color + "30",
                      background: color + "10",
                    }}
                  >
                    {num}
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1">{title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-10 text-center" style={{ borderColor: "rgba(255,255,255,0.05)", zIndex: 2, position: "relative" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
        </div>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          © 2025 CrackIt · Built for engineers, by engineers.
        </p>
      </footer>
    </div>
  );
}