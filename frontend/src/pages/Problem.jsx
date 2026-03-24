import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { UserButton } from "@clerk/react";
import { Code2, ArrowLeft, Play, CheckCircle2, XCircle, ChevronRight, BookOpen, Terminal, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import problems from "../data/problems";
import { runOnPiston } from "../hooks/usePiston";
import axiosInstance from "../lib/axios";

const DIFF_CONFIG = {
  Easy:   { color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.25)"  },
  Medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)"  },
  Hard:   { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)" },
};

export default function Problem() {
  const { id } = useParams();
  const problem = problems.find(p => p.id === parseInt(id));

  const [language, setLanguage]   = useState("python");
  const [code, setCode]           = useState(problem?.starterCode["python"] || "");
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [isSolved, setIsSolved]   = useState(false);   // ← NEW

  // splitter state — left panel width as % of container
  const [leftWidth, setLeftWidth] = useState(38);
  const isDragging                = useRef(false);
  const containerRef              = useRef(null);

  // mobile tab state
  const [mobileTab, setMobileTab] = useState("problem");
  const [isMobile, setIsMobile]   = useState(false);

    // ── SOLVED STATE ──────────────────────────────────────────────────────────
  const [solvedIds, setSolvedIds] = useState(new Set());

  useEffect(() => {
    axiosInstance.get("/problems/my")
      .then(res => {
        const ids = new Set(res.data.solved.map(s => String(s.problemId)));
        setSolvedIds(ids);
        if (ids.has(String(problem.id))) {
        setIsSolved(true);
      }
      })
      .catch(err => console.error("Failed to fetch solved problems:", err));
  }, []);
  // ──────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // drag handlers
  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect  = containerRef.current.getBoundingClientRect();
    const pct   = ((e.clientX - rect.left) / rect.width) * 100;
    setLeftWidth(Math.min(Math.max(pct, 20), 70));
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  if (!problem) return (
    <div className="min-h-screen flex items-center justify-center text-white"
      style={{ background: "#08080f" }}>
      <p>Problem not found.</p>
    </div>
  );

  const diff = DIFF_CONFIG[problem.difficulty];

  const handleLangChange = (lang) => {
    setLanguage(lang);
    setCode(problem.starterCode[lang] || "");
    setResults([]);
  };

  const handleRun = async () => {
    if (isMobile) setMobileTab("editor");
    setLoading(true);
    setResults([]);

    const toastId = toast.loading("Running test cases...", {
      style: { background: "rgba(12,12,22,0.95)", color: "#fff", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px" },
    });

    try {
      const res = await runOnPiston(code, language, problem.testCases);
      setResults(res);
      const allPassed = res.every(r => r.passed);

      if (allPassed) {
        toast.success(`All ${res.length} test cases passed!`, {
          id: toastId,
          style: { background: "rgba(12,12,22,0.95)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "12px" },
          iconTheme: { primary: "#34d399", secondary: "#08080f" },
        });

        // ── MARK AS SOLVED ──────────────────────────────────────────────────
        try {
          await axiosInstance.post("/problems/solve", {
            problemId: String(problem.id)
          });
          setIsSolved(true);
        } catch (err) {
          console.error("Failed to save solved status:", err);
          // non-blocking — user still sees the pass result
        }
        // ───────────────────────────────────────────────────────────────────

      } else {
        const failed = res.filter(r => !r.passed).length;
        toast.error(`${failed} test case${failed > 1 ? "s" : ""} failed`, {
          id: toastId,
          style: { background: "rgba(12,12,22,0.95)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "12px" },
          iconTheme: { primary: "#f87171", secondary: "#08080f" },
        });
      }
    } catch {
      toast.error("Execution failed. Is backend running?", {
        id: toastId,
        style: { background: "rgba(12,12,22,0.95)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "12px" },
      });
    }
    setLoading(false);
  };

  const allPassed = results.length > 0 && results.every(r => r.passed);

  // ─── shared panels ────────────────────────────────────────────────────────

  const ProblemPanel = (
    <div className="h-full overflow-y-auto p-5 space-y-5">
      <div>
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h1 className="text-xl font-black tracking-tight">{problem.title}</h1>
          {/* ── SOLVED BADGE ── */}
          {isSolved && (
            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ color: "#34d399", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)" }}>
              <CheckCircle2 className="size-3" /> Solved
            </span>
          )}
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ color: diff.color, background: diff.bg, border: `1px solid ${diff.border}` }}>
          {problem.difficulty}
        </span>
      </div>

      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

      <pre className="text-sm leading-relaxed whitespace-pre-wrap"
        style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        {problem.description}
      </pre>

      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: "rgba(255,255,255,0.25)" }}>Test Cases</h2>
        <div className="space-y-2">
          {problem.testCases.map((tc, i) => (
            <div key={i} className="rounded-xl p-4 border"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
              <span className="text-xs font-mono font-bold mb-2 block"
                style={{ color: "rgba(99,102,241,0.7)" }}>Case {i + 1}</span>
              <div className="space-y-1 text-xs font-mono">
                <p>
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>Input    </span>
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>{tc.input}</span>
                </p>
                <p>
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>Expected </span>
                  <span style={{ color: "#34d399" }}>{tc.expected}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const EditorPanel = (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={val => setCode(val)}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            lineHeight: 1.8,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            renderLineHighlight: "gutter",
          }}
        />
      </div>

      {results.length > 0 && (
        <div className="shrink-0 border-t overflow-y-auto"
          style={{ maxHeight: "220px", borderColor: "rgba(255,255,255,0.06)", background: "rgba(8,8,15,0.95)" }}>
          <div className="flex items-center gap-3 px-5 py-3 border-b"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {allPassed
              ? <CheckCircle2 className="size-4" style={{ color: "#34d399" }} />
              : <XCircle className="size-4" style={{ color: "#f87171" }} />}
            <span className="text-sm font-bold"
              style={{ color: allPassed ? "#34d399" : "#f87171" }}>
              {allPassed ? "All test cases passed" : "Some test cases failed"}
            </span>
            <span className="text-xs ml-auto" style={{ color: "rgba(255,255,255,0.25)" }}>
              {results.filter(r => r.passed).length}/{results.length} passed
            </span>
          </div>
          <div className="p-4 space-y-2">
            {results.map((r, i) => (
              <div key={i} className="rounded-xl p-3 border"
                style={{
                  background: r.passed ? "rgba(52,211,153,0.04)" : "rgba(248,113,113,0.04)",
                  borderColor: r.passed ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)",
                  borderLeft: `3px solid ${r.passed ? "#34d399" : "#f87171"}`,
                }}>
                <div className="flex items-center gap-2 mb-1.5">
                  {r.passed
                    ? <CheckCircle2 className="size-3.5" style={{ color: "#34d399" }} />
                    : <XCircle className="size-3.5" style={{ color: "#f87171" }} />}
                  <span className="text-xs font-bold"
                    style={{ color: r.passed ? "#34d399" : "#f87171" }}>
                    Case {i + 1}
                  </span>
                </div>
                <div className="text-xs font-mono space-y-0.5">
                  <p>
                    <span style={{ color: "rgba(255,255,255,0.3)" }}>Input    </span>
                    <span style={{ color: "rgba(255,255,255,0.6)" }}>{r.input}</span>
                  </p>
                  <p>
                    <span style={{ color: "rgba(255,255,255,0.3)" }}>Expected </span>
                    <span style={{ color: "#34d399" }}>{r.expected}</span>
                  </p>
                  {!r.passed && (
                    <p>
                      <span style={{ color: "rgba(255,255,255,0.3)" }}>Got      </span>
                      <span style={{ color: "#f87171" }}>{r.actual}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen flex flex-col text-white overflow-hidden"
      style={{ background: "#08080f", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* BG GRID */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="fixed bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />

      {/* NAVBAR */}
      <nav className="relative z-50 border-b shrink-0"
        style={{ background: "rgba(8,8,15,0.85)", backdropFilter: "blur(24px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="h-14 px-4 flex items-center justify-between">

          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="size-7 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6366f1, #22c55e)" }}>
                <Code2 className="size-3.5 text-white" />
              </div>
              <span className="font-bold tracking-tight hidden sm:block"
                style={{ fontFamily: "'Courier New', monospace", fontSize: "15px" }}>
                Crack<span style={{ color: "#818cf8" }}>It</span>
              </span>
            </Link>

            <div className="hidden sm:block" style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.08)" }} />

            <Link to="/problems"
              className="hidden sm:flex items-center gap-1.5 text-xs shrink-0 transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.35)" }}
              onMouseEnter={e => e.currentTarget.style.color = "#818cf8"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>
              <ArrowLeft className="size-3.5" /> Problems
            </Link>

            <ChevronRight className="hidden sm:block size-3 shrink-0" style={{ color: "rgba(255,255,255,0.2)" }} />

            <span className="text-xs font-medium truncate" style={{ color: "rgba(255,255,255,0.6)", maxWidth: "160px" }}>
              {problem.title}
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 shrink-0">
            {/* ── LEADERBOARD LINK ── */}
            <Link to="/leaderboard"
              className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all duration-200"
              style={{ color: "rgba(255,255,255,0.4)", borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#f59e0b"; e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
              <Trophy className="size-3.5" /> Board
            </Link>

            <select value={language} onChange={e => handleLangChange(e.target.value)}
              className="text-xs px-2 py-1.5 rounded-lg border outline-none"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}>
              <option className="bg-green-400" value="python">Python</option>
              <option className="bg-green-400" value="javascript">JavaScript</option>
              <option className="bg-green-400" value="java">Java</option>
            </select>

            <button onClick={handleRun} disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 disabled:opacity-50"
              style={{
                background: loading ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg, #6366f1, #34d399)",
                boxShadow: loading ? "none" : "0 0 20px rgba(99,102,241,0.3)",
              }}>
              <Play className="size-3" />
              <span className="hidden sm:inline">{loading ? "Running..." : "Run Code"}</span>
              <span className="sm:hidden">{loading ? "..." : "Run"}</span>
            </button>

            <UserButton />
          </div>
        </div>

        {/* Mobile tabs */}
        {isMobile && (
          <div className="flex border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {[
              { key: "problem", label: "Problem",  icon: <BookOpen className="size-3.5" /> },
              { key: "editor",  label: "Editor",   icon: <Terminal className="size-3.5" /> },
            ].map(tab => (
              <button key={tab.key} onClick={() => setMobileTab(tab.key)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-all duration-200"
                style={{
                  color: mobileTab === tab.key ? "#818cf8" : "rgba(255,255,255,0.3)",
                  borderBottom: mobileTab === tab.key ? "2px solid #818cf8" : "2px solid transparent",
                  background: mobileTab === tab.key ? "rgba(99,102,241,0.05)" : "transparent",
                }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* MAIN */}
      {isMobile ? (
        <div className="flex-1 overflow-hidden relative">
          {mobileTab === "problem" ? ProblemPanel : EditorPanel}
        </div>
      ) : (
        <div ref={containerRef} className="flex flex-1 overflow-hidden relative">

          <div className="flex flex-col overflow-hidden border-r"
            style={{ width: `${leftWidth}%`, borderColor: "rgba(255,255,255,0.05)" }}>
            {ProblemPanel}
          </div>

          <div
            onMouseDown={onMouseDown}
            className="shrink-0 flex items-center justify-center group z-10"
            style={{ width: "12px", cursor: "col-resize", background: "transparent", position: "relative" }}
          >
            <div style={{ width: "2px", height: "100%", background: "rgba(255,255,255,0.05)", transition: "background 0.2s", position: "absolute" }}
              className="group-hover:bg-indigo-500/40" />
            <div className="relative z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {[0, 1, 2].map(i => (
                <div key={i} className="rounded-full"
                  style={{ width: "4px", height: "4px", background: "#818cf8" }} />
              ))}
            </div>
          </div>

          <div className="flex flex-col overflow-hidden"
            style={{ width: `${100 - leftWidth}%` }}>
            {EditorPanel}
          </div>
        </div>
      )}
    </div>
  );
}