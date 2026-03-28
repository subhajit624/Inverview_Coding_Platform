import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUser, UserButton } from "@clerk/react";
import Editor from "@monaco-editor/react";
import {
  ArrowLeft, Play, CheckCircle2, XCircle,
  ChevronRight, Video, VideoOff, PhoneOff,
  Users, AlertCircle, BookOpen, Terminal,
} from "lucide-react";
import toast from "react-hot-toast";
import problems from "../data/problems";
import { runOnPiston } from "../hooks/usePiston";
import axiosInstance from "../lib/axios";

const DIFF_CONFIG = {
  Easy:   { color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.25)" },
  Medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)" },
  Hard:   { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)" },
};

export default function Interview() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { user }  = useUser();

  // ── Session / Problem ─────────────────────────────────────────────────────
  const [session,     setSession]     = useState(null);
  const [sessLoading, setSessLoading] = useState(true);
  const [sessError,   setSessError]   = useState(null);
  const [problem,     setProblem]     = useState(null);

  // ── Editor ────────────────────────────────────────────────────────────────
  const [language, setLanguage] = useState("python");
  const [code,     setCode]     = useState("");
  const [results,  setResults]  = useState([]);
  const [running,  setRunning]  = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  // ── Video ─────────────────────────────────────────────────────────────────
  const [showVideo, setShowVideo] = useState(true);

  // ── End ───────────────────────────────────────────────────────────────────
  const [ending, setEnding] = useState(false);

  // ── Mobile ────────────────────────────────────────────────────────────────
  const [mobileTab, setMobileTab] = useState("problem");
  const [isMobile,  setIsMobile]  = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Horizontal splitter ───────────────────────────────────────────────────
  const [leftWidth,  setLeftWidth]  = useState(37);
  const hDragging                    = useRef(false);
  const containerRef                 = useRef(null);

  const onHMouseDown = useCallback(e => {
    e.preventDefault();
    hDragging.current          = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const onHMouseMove = useCallback(e => {
    if (!hDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct  = ((e.clientX - rect.left) / rect.width) * 100;
    setLeftWidth(Math.min(Math.max(pct, 20), 60));
  }, []);

  const onHMouseUp = useCallback(() => {
    hDragging.current          = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onHMouseMove);
    window.addEventListener("mouseup",   onHMouseUp);
    return () => {
      window.removeEventListener("mousemove", onHMouseMove);
      window.removeEventListener("mouseup",   onHMouseUp);
    };
  }, [onHMouseMove, onHMouseUp]);

  // ── Vertical splitter (editor vs video) ──────────────────────────────────
  const [videoHeight, setVideoHeight] = useState(240);
  const vDragging                      = useRef(false);
  const rightPanelRef                  = useRef(null);

  const onVMouseDown = useCallback(e => {
    e.preventDefault();
    vDragging.current          = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, []);

  const onVMouseMove = useCallback(e => {
    if (!vDragging.current || !rightPanelRef.current) return;
    const rect       = rightPanelRef.current.getBoundingClientRect();
    const fromBottom = rect.bottom - e.clientY;
    setVideoHeight(Math.min(Math.max(fromBottom, 160), 480));
  }, []);

  const onVMouseUp = useCallback(() => {
    vDragging.current          = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  const onVTouchMove = useCallback(e => {
    if (!rightPanelRef.current) return;
    const touch      = e.touches[0];
    const rect       = rightPanelRef.current.getBoundingClientRect();
    const fromBottom = rect.bottom - touch.clientY;
    setVideoHeight(Math.min(Math.max(fromBottom, 140), 380));
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onVMouseMove);
    window.addEventListener("mouseup",   onVMouseUp);
    return () => {
      window.removeEventListener("mousemove", onVMouseMove);
      window.removeEventListener("mouseup",   onVMouseUp);
    };
  }, [onVMouseMove, onVMouseUp]);

  // ── Fetch session ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const init = async () => {
      try {
        setSessLoading(true);
        const res  = await axiosInstance.get(`/session/${id}`);
        const sess = res.data.session;
        setSession(sess);

        const prob = problems.find(p => p.title === sess.problem);
        setProblem(prob || null);
        if (prob) setCode(prob.starterCode["python"] || "");

        const isHost        = sess.host?.clerkId === user.id;
        const isParticipant = sess.participant?.clerkId === user.id;

        if (!isHost && !isParticipant && !sess.participant && sess.status === "active") {
          try {
            const joinRes = await axiosInstance.post(`/session/${id}/join`);
            setSession(joinRes.data.session);
          } catch (joinErr) {
            console.log("Join:", joinErr.response?.data?.error);
          }
        }
      } catch {
        setSessError("Session not found or an error occurred.");
      } finally {
        setSessLoading(false);
      }
    };
    init();
  }, [id, user]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleLangChange = lang => {
    setLanguage(lang);
    if (problem) setCode(problem.starterCode[lang] || "");
    setResults([]);
  };

  const handleRun = async () => {
    if (!problem) return;
    if (isMobile) setMobileTab("editor");
    setRunning(true);
    setResults([]);

    const toastId = toast.loading("Running test cases...", {
      style: { background: "rgba(12,12,22,0.95)", color: "#fff", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px" },
    });

    try {
      const res       = await runOnPiston(code, language, problem.testCases);
      const allPassed = res.every(r => r.passed);
      setResults(res);

      if (allPassed) {
        toast.success(`All ${res.length} test cases passed!`, {
          id: toastId,
          style: { background: "rgba(12,12,22,0.95)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "12px" },
          iconTheme: { primary: "#34d399", secondary: "#08080f" },
        });
        try {
          await axiosInstance.post("/problems/solve", { problemId: String(problem.id) });
          setIsSolved(true);
        } catch (e) { console.error(e); }
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
    setRunning(false);
  };

  const handleEnd = async () => {
    setEnding(true);
    try {
      await axiosInstance.post(`/session/${id}/end`);
      toast.success("Session ended", {
        style: { background: "rgba(12,12,22,0.95)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "12px" },
      });
      navigate("/interview-dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to end session", {
        style: { background: "rgba(12,12,22,0.95)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "12px" },
      });
    } finally {
      setEnding(false);
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const isHost    = session?.host?.clerkId === user?.id;
  const allPassed = results.length > 0 && results.every(r => r.passed);
  const diff      = problem ? DIFF_CONFIG[problem.difficulty] : null;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (sessLoading) return (
    <div className="h-screen flex items-center justify-center text-white" style={{ background: "#08080f" }}>
      <div className="text-center">
        <div className="size-8 rounded-full border-2 animate-spin mx-auto mb-4"
          style={{ borderColor: "rgba(99,102,241,0.5)", borderTopColor: "transparent" }} />
        <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading session...</p>
      </div>
    </div>
  );

  // ── Error ─────────────────────────────────────────────────────────────────
  if (sessError || !session || !problem) return (
    <div className="h-screen flex items-center justify-center text-white" style={{ background: "#08080f" }}>
      <div className="text-center px-6">
        <AlertCircle className="size-12 mx-auto mb-4" style={{ color: "#f87171" }} />
        <p className="mb-2 text-base font-semibold">{sessError || "Session or problem not found."}</p>
        <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.35)" }}>
          The session may have ended or the link is invalid.
        </p>
        <Link to="/interview-dashboard"
          className="text-sm px-5 py-2.5 rounded-xl font-semibold"
          style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}>
          Back to Sessions
        </Link>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // SHARED PANELS
  // ─────────────────────────────────────────────────────────────────────────

  const ProblemPanel = (
    <div className="h-full overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5">
      {/* Title + solved badge */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <h1 className="text-lg sm:text-xl font-black tracking-tight">{problem.title}</h1>
          {isSolved && (
            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ color: "#34d399", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)" }}>
              <CheckCircle2 className="size-3" /> Solved
            </span>
          )}
        </div>
        {diff && (
          <span className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ color: diff.color, background: diff.bg, border: `1px solid ${diff.border}` }}>
            {problem.difficulty}
          </span>
        )}
      </div>

      {/* Session info */}
      <div className="rounded-xl border p-3"
        style={{ background: "rgba(99,102,241,0.06)", borderColor: "rgba(99,102,241,0.18)" }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2"
          style={{ color: "rgba(129,140,248,0.6)" }}>Session</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full shrink-0" style={{ background: "#34d399" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              Host: <span style={{ color: "rgba(255,255,255,0.75)" }}>{session.host?.name || "Unknown"}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full shrink-0"
              style={{ background: session.participant ? "#818cf8" : "rgba(255,255,255,0.15)" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              {session.participant
                ? <>Partner: <span style={{ color: "rgba(255,255,255,0.75)" }}>{session.participant.name}</span></>
                : <span style={{ color: "rgba(255,255,255,0.3)" }}>Waiting for partner...</span>}
            </span>
          </div>
        </div>
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
              <span className="text-xs font-mono font-bold block mb-2"
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

  // Editor + Results + vertical-drag + Video
  const EditorPanel = (
    <div ref={rightPanelRef} className="flex flex-col h-full overflow-hidden">

      {/* Monaco */}
      <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={val => setCode(val)}
          theme="vs-dark"
          options={{
            fontSize: isMobile ? 12 : 14,
            minimap: { enabled: false },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            lineHeight: 1.8,
            padding: { top: 12 },
            scrollBeyondLastLine: false,
            renderLineHighlight: "gutter",
          }}
        />
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="shrink-0 border-t overflow-y-auto"
          style={{
            maxHeight: isMobile ? "160px" : "200px",
            borderColor: "rgba(255,255,255,0.06)",
            background: "rgba(8,8,15,0.97)",
          }}>
          <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {allPassed
              ? <CheckCircle2 className="size-4 shrink-0" style={{ color: "#34d399" }} />
              : <XCircle      className="size-4 shrink-0" style={{ color: "#f87171" }} />}
            <span className="text-sm font-bold" style={{ color: allPassed ? "#34d399" : "#f87171" }}>
              {allPassed ? "All passed!" : "Some failed"}
            </span>
            <span className="text-xs ml-auto" style={{ color: "rgba(255,255,255,0.25)" }}>
              {results.filter(r => r.passed).length}/{results.length} passed
            </span>
          </div>
          <div className="p-3 sm:p-4 space-y-2">
            {results.map((r, i) => (
              <div key={i} className="rounded-xl p-3 border"
                style={{
                  background:  r.passed ? "rgba(52,211,153,0.04)" : "rgba(248,113,113,0.04)",
                  borderColor: r.passed ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)",
                  borderLeft: `3px solid ${r.passed ? "#34d399" : "#f87171"}`,
                }}>
                <div className="flex items-center gap-2 mb-1.5">
                  {r.passed
                    ? <CheckCircle2 className="size-3.5" style={{ color: "#34d399" }} />
                    : <XCircle      className="size-3.5" style={{ color: "#f87171" }} />}
                  <span className="text-xs font-bold"
                    style={{ color: r.passed ? "#34d399" : "#f87171" }}>Case {i + 1}</span>
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

      {/* ── Vertical drag handle ── (only when video visible) */}
      {showVideo && (
        <>
          <div
            onMouseDown={onVMouseDown}
            onTouchMove={onVTouchMove}
            className="shrink-0 flex items-center justify-center group select-none"
            style={{
              height: "14px",
              cursor: "row-resize",
              background: "rgba(8,8,15,0.97)",
              borderTop:    "1px solid rgba(255,255,255,0.05)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              position: "relative",
              zIndex: 10,
              touchAction: "none",
            }}
          >
            {/* Track */}
            <div style={{
              position: "absolute",
              left: 0, right: 0, top: "50%",
              height: "2px",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.04)",
            }} className="group-hover:bg-indigo-500/30 transition-colors duration-200" />
            {/* Grip dots */}
            <div className="relative z-10 flex gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity duration-200">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-full"
                  style={{ width: "4px", height: "4px", background: "#818cf8" }} />
              ))}
            </div>
          </div>

          {/* Jitsi iframe */}
          <div className="shrink-0 overflow-hidden" style={{ height: `${videoHeight}px`, background: "#000" }}>
            <iframe
              src={`https://meet.jit.si/crackit-${session.callId}#userInfo.displayName="${encodeURIComponent(user?.fullName || user?.username || "User")}"`}
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              allowFullScreen
            />
          </div>
        </>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col text-white overflow-hidden"
      style={{ background: "#08080f", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* BG */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* ── NAVBAR ── */}
      <nav className="relative z-50 shrink-0 border-b"
        style={{ background: "rgba(8,8,15,0.9)", backdropFilter: "blur(24px)", borderColor: "rgba(255,255,255,0.05)" }}>

        <div className="h-14 px-3 sm:px-4 flex items-center justify-between gap-2">

          {/* Left breadcrumb */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <Link to="/interview-dashboard"
              className="flex items-center gap-1 text-xs shrink-0 transition-colors duration-200 px-2 py-1.5 rounded-lg"
              style={{ color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={e => e.currentTarget.style.color = "#818cf8"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
              <ArrowLeft className="size-3.5" />
              <span className="hidden sm:inline ml-0.5">Sessions</span>
            </Link>

            <ChevronRight className="size-3 hidden sm:block shrink-0" style={{ color: "rgba(255,255,255,0.18)" }} />

            <span className="text-xs font-medium truncate hidden sm:block"
              style={{ color: "rgba(255,255,255,0.6)", maxWidth: "130px" }}>
              {problem.title}
            </span>

            {diff && (
              <span className="hidden md:inline text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                style={{ color: diff.color, background: diff.bg, border: `1px solid ${diff.border}` }}>
                {problem.difficulty}
              </span>
            )}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">

            {/* Participants pill */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border"
              style={{
                color:       session.participant ? "#818cf8" : "rgba(255,255,255,0.35)",
                borderColor: session.participant ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.08)",
                background:  session.participant ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.03)",
              }}>
              <Users className="size-3.5" />
              <span>{session.participant ? "2/2" : "1/2"}</span>
            </div>

            {/* Video toggle */}
            <button onClick={() => setShowVideo(!showVideo)}
              className="flex items-center gap-1 text-xs px-2 sm:px-2.5 py-1.5 rounded-lg border transition-all duration-200"
              style={{
                color:       showVideo ? "#34d399" : "rgba(255,255,255,0.4)",
                borderColor: showVideo ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.08)",
                background:  showVideo ? "rgba(52,211,153,0.07)" : "rgba(255,255,255,0.03)",
              }}>
              {showVideo ? <Video className="size-3.5" /> : <VideoOff className="size-3.5" />}
              <span className="hidden sm:inline ml-1">{showVideo ? "Hide" : "Video"}</span>
            </button>

            {/* Language */}
            <select value={language} onChange={e => handleLangChange(e.target.value)}
              className="text-xs px-1.5 sm:px-2 py-1.5 rounded-lg border outline-none"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}>
              <option className="bg-zinc-900" value="python">Python</option>
              <option className="bg-zinc-900" value="javascript">JS</option>
              <option className="bg-zinc-900" value="java">Java</option>
            </select>

            {/* Run */}
            <button onClick={handleRun} disabled={running}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 disabled:opacity-50"
              style={{
                background: running ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg, #6366f1, #34d399)",
                boxShadow:  running ? "none" : "0 0 16px rgba(99,102,241,0.3)",
              }}>
              <Play className="size-3" />
              <span className="hidden sm:inline ml-1">{running ? "Running..." : "Run"}</span>
            </button>

            {/* End (host only) */}
            {isHost && (
              <button onClick={handleEnd} disabled={ending}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 disabled:opacity-50"
                style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(248,113,113,0.1)"}>
                <PhoneOff className="size-3.5" />
                <span className="hidden sm:inline ml-1">{ending ? "..." : "End"}</span>
              </button>
            )}

            <UserButton />
          </div>
        </div>

        {/* Mobile tab bar */}
        {isMobile && (
          <div className="flex border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {[
              { key: "problem", label: "Problem", icon: <BookOpen className="size-3.5" /> },
              { key: "editor",  label: "Editor",  icon: <Terminal  className="size-3.5" /> },
            ].map(tab => (
              <button key={tab.key} onClick={() => setMobileTab(tab.key)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-all duration-200"
                style={{
                  color:        mobileTab === tab.key ? "#818cf8" : "rgba(255,255,255,0.3)",
                  borderBottom: mobileTab === tab.key ? "2px solid #818cf8" : "2px solid transparent",
                  background:   mobileTab === tab.key ? "rgba(99,102,241,0.05)" : "transparent",
                }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── CONTENT ── */}
      {isMobile ? (
        <div className="flex-1 overflow-hidden">
          {mobileTab === "problem" ? ProblemPanel : EditorPanel}
        </div>
      ) : (
        <div ref={containerRef} className="flex flex-1 overflow-hidden">

          {/* Left: Problem */}
          <div className="flex flex-col border-r overflow-hidden"
            style={{ width: `${leftWidth}%`, borderColor: "rgba(255,255,255,0.05)" }}>
            {ProblemPanel}
          </div>

          {/* Horizontal drag handle */}
          <div
            onMouseDown={onHMouseDown}
            className="shrink-0 flex items-center justify-center group z-10"
            style={{ width: "12px", cursor: "col-resize", position: "relative" }}
          >
            <div style={{
              position: "absolute",
              width: "2px", height: "100%",
              background: "rgba(255,255,255,0.05)",
            }} className="group-hover:bg-indigo-500/30 transition-colors duration-200" />
            <div className="relative z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {[0, 1, 2].map(i => (
                <div key={i} className="rounded-full"
                  style={{ width: "4px", height: "4px", background: "#818cf8" }} />
              ))}
            </div>
          </div>

          {/* Right: Editor + Video */}
          <div className="flex flex-col overflow-hidden"
            style={{ width: `${100 - leftWidth}%` }}>
            {EditorPanel}
          </div>
        </div>
      )}
    </div>
  );
}