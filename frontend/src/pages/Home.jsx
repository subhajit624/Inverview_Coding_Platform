import { SignInButton } from "@clerk/react";
import { Link } from "react-router-dom";
import {
  Code2,
  Video,
  Zap,
  Terminal,
  ArrowRight,
  CheckCircle2,
  Shield,
  BrainCircuit,
  FileSearch,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: <BrainCircuit className="size-6" />,
    title: "AI Interviewer",
    desc: "Practice with an AI that asks real DSA and system design questions, evaluates your answers, and gives detailed feedback — just like a real interview.",
    color: "text-violet-400",
    border: "rgba(139,92,246,0.25)",
    glow: "rgba(139,92,246,0.06)",
    tag: "AI Powered",
    tagColor: "rgba(139,92,246,0.15)",
    tagText: "#a78bfa",
  },
  {
    icon: <FileSearch className="size-6" />,
    title: "Resume Analyzer",
    desc: "Upload your resume and get instant AI-driven analysis — skill gaps, keyword suggestions, ATS compatibility score, and role-fit recommendations.",
    color: "text-cyan-400",
    border: "rgba(34,211,238,0.25)",
    glow: "rgba(34,211,238,0.06)",
    tag: "AI Powered",
    tagColor: "rgba(34,211,238,0.15)",
    tagText: "#67e8f9",
  },
  {
    icon: <Video className="size-6" />,
    title: "HD Video Calls",
    desc: "Crystal-clear video and audio for seamless communication. No downloads needed — works entirely in your browser.",
    color: "text-emerald-400",
    border: "rgba(52,211,153,0.25)",
    glow: "rgba(52,211,153,0.06)",
    tag: "Real-time",
    tagColor: "rgba(52,211,153,0.15)",
    tagText: "#6ee7b7",
  },
  {
    icon: <Code2 className="size-6" />,
    title: "Live Code Editor",
    desc: "Collaborate in a shared editor with syntax highlighting, multiple language support, and real-time cursor tracking.",
    color: "text-orange-400",
    border: "rgba(251,146,60,0.25)",
    glow: "rgba(251,146,60,0.06)",
    tag: "Collaborative",
    tagColor: "rgba(251,146,60,0.15)",
    tagText: "#fdba74",
  },
  {
    icon: <Terminal className="size-6" />,
    title: "Run Code Instantly",
    desc: "Execute code directly in the browser across multiple languages. No setup, no delays — just write and run.",
    color: "text-pink-400",
    border: "rgba(244,114,182,0.25)",
    glow: "rgba(244,114,182,0.06)",
    tag: "Multi-language",
    tagColor: "rgba(244,114,182,0.15)",
    tagText: "#f9a8d4",
  },
  {
    icon: <Shield className="size-6" />,
    title: "Secure & Private",
    desc: "End-to-end encrypted sessions ensure your code, resume, and conversations remain completely private.",
    color: "text-yellow-400",
    border: "rgba(250,204,21,0.25)",
    glow: "rgba(250,204,21,0.06)",
    tag: "Encrypted",
    tagColor: "rgba(250,204,21,0.15)",
    tagText: "#fde047",
  },
];

const CODE_LINES = [
  { txt: "function twoSum(nums, target) {", color: "text-cyan-300" },
  { txt: "  const map = new Map();", color: "text-slate-300" },
  { txt: "  for (let i = 0; i < nums.length; i++) {", color: "text-violet-300" },
  { txt: "    const comp = target - nums[i];", color: "text-slate-300" },
  { txt: "    if (map.has(comp)) {", color: "text-emerald-300" },
  { txt: "      return [map.get(comp), i];", color: "text-orange-300" },
  { txt: "    }", color: "text-slate-400" },
  { txt: "    map.set(nums[i], i);", color: "text-slate-300" },
  { txt: "  }", color: "text-slate-400" },
  { txt: "}", color: "text-cyan-300" },
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
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="fixed bottom-1/3 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />

      {/* NAVBAR */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(8,8,15,0.85)",
          backdropFilter: "blur(24px)",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #22c55e)" }}>
              <Code2 className="size-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Courier New', monospace" }}>
              Crack<span style={{ color: "#818cf8" }}>It</span>
            </span>
          </Link>

          <SignInButton mode="modal">
            <button
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 0 24px rgba(99,102,241,0.35)",
              }}
            >
              Sign In <ArrowRight className="size-3.5" />
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-28 pb-24">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}
          <div className="space-y-8">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border"
              style={{
                background: "rgba(99,102,241,0.08)",
                borderColor: "rgba(99,102,241,0.25)",
                color: "#a5b4fc",
              }}
            >
              <Sparkles className="size-3" />
              AI-Powered Interview Platform
            </div>

            <h1 className="text-5xl lg:text-[3.75rem] font-black leading-[1.1] tracking-tight">
              Code Together,
              <br />
              <span style={{
                background: "linear-gradient(135deg, #818cf8 0%, #34d399 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Win Together.
              </span>
            </h1>

            <p className="text-lg leading-relaxed max-w-md" style={{ color: "rgba(255,255,255,0.5)" }}>
              Practice with an AI interviewer, get your resume analyzed, and give interview with real interviewer & practice DSA question ( multiple language supported ) — all in one place.
            </p>

            <ul className="space-y-3.5">
              {[
                "AI interviewer with real-time feedback",
                "Resume analysis with ATS scoring",
                "Live collaborative code editor",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                  <CheckCircle2 className="size-4 shrink-0" style={{ color: "#34d399" }} />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4 pt-1">
              <SignInButton mode="modal">
                <button
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #34d399)",
                    boxShadow: "0 0 35px rgba(99,102,241,0.3)",
                  }}
                >
                  Get Started Free <ArrowRight className="size-4" />
                </button>
              </SignInButton>
            </div>
          </div>

          {/* RIGHT — code editor mock */}
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              background: "rgba(12,12,20,0.95)",
              borderColor: "rgba(255,255,255,0.07)",
              boxShadow: "0 0 80px rgba(99,102,241,0.12), 0 30px 60px rgba(0,0,0,0.6)",
            }}
          >
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full" style={{ background: "#ef4444" }} />
                <div className="size-3 rounded-full" style={{ background: "#f59e0b" }} />
                <div className="size-3 rounded-full" style={{ background: "#22c55e" }} />
              </div>
              <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>twoSum.js</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
                style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80" }}>
                <span className="size-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                Live Session
              </div>
            </div>

            {/* Code lines */}
            <div className="p-5 font-mono text-sm leading-[1.85]">
              {CODE_LINES.map((line, i) => (
                <div key={i} className={line.color}>
                  <span style={{ color: "rgba(255,255,255,0.15)", userSelect: "none", marginRight: "14px", fontSize: "11px" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {line.txt}
                </div>
              ))}
            </div>

            {/* AI feedback strip */}
            <div
              className="mx-4 mb-4 rounded-xl p-3 border flex items-start gap-3"
              style={{
                background: "rgba(139,92,246,0.08)",
                borderColor: "rgba(139,92,246,0.2)",
              }}
            >
              <BrainCircuit className="size-4 mt-0.5 shrink-0" style={{ color: "#a78bfa" }} />
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: "#a78bfa" }}>AI Interviewer</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Good use of HashMap! Time complexity is O(n). Can you now solve it with O(1) space?
                </p>
              </div>
            </div>

            {/* Footer bar */}
            <div className="flex items-center justify-between px-5 py-3 border-t text-xs font-mono"
              style={{
                background: "rgba(99,102,241,0.06)",
                borderColor: "rgba(99,102,241,0.15)",
                color: "rgba(255,255,255,0.35)",
              }}>
              <span>JavaScript</span>
              <div className="flex items-center gap-3">
                <span style={{ color: "#4ade80" }}>✓ 3/3 tests passed</span>
                <span>2 participants</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border"
            style={{ background: "rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.2)", color: "#818cf8" }}>
            <Zap className="size-3" /> Everything in one platform
          </div>
          <h2 className="text-4xl font-black tracking-tight">
            Built for serious engineers
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
            From AI-driven practice to live collaborative interviews — every tool you need, zero context switching.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon, title, desc, color, border, glow, tag, tagColor, tagText }) => (
            <div
              key={title}
              className="rounded-2xl p-6 border group hover:-translate-y-1 transition-all duration-300 cursor-default relative overflow-hidden"
              style={{ background: "rgba(12,12,22,0.8)", borderColor: border }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(circle at 30% 30%, ${glow}, transparent 70%)` }} />

              <div className="relative space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`${color} size-11 rounded-xl flex items-center justify-center border`}
                    style={{ background: glow, borderColor: border }}>
                    {icon}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: tagColor, color: tagText }}>
                    {tag}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base mb-2">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{desc}</p>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Learn more <ChevronRight className="size-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS + CTA */}
      <section className="max-w-6xl mx-auto px-6 py-8 mb-16">
        <div className="rounded-3xl p-12 border relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(34,211,153,0.04) 100%)",
            borderColor: "rgba(99,102,241,0.2)",
          }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />

          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight">
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
              <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Sign up in seconds. No credit card needed. Start practicing with AI, get your resume scored, and collaborate with real engineers today.
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

            <div className="space-y-6">
              {[
                { num: "01", title: "Create your account", desc: "Sign up instantly with Google or email — no setup required." },
                { num: "02", title: "Analyze your resume", desc: "Upload your resume and get AI-powered feedback in seconds." },
                { num: "03", title: "Practice & collaborate", desc: "Start an AI interview session or invite a real partner to code live." },
              ].map(({ num, title, desc }) => (
                <div key={num} className="flex items-start gap-4">
                  <span className="text-xs font-black font-mono shrink-0 mt-1" style={{ color: "rgba(129,140,248,0.7)" }}>{num}</span>
                  <div>
                    <p className="font-semibold text-sm mb-1">{title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-8 text-center text-sm"
        style={{ borderColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.25)" }}>
        © 2025 CrackIt · Built for engineers, by engineers.
      </footer>
    </div>
  );
}