import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserButton } from "@clerk/react";
import { ArrowLeft, Bot, Briefcase, History, PlayCircle } from "lucide-react";

const STYLES = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
.fade-up   { animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both; }
.fade-up-1 { animation-delay: .05s; }
.fade-up-2 { animation-delay: .12s; }
.fade-up-3 { animation-delay: .20s; }
.fade-up-4 { animation-delay: .30s; }
.shimmer-text {
  background: linear-gradient(90deg, #818cf8 0%, #34d399 45%, #818cf8 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
.role-input::placeholder { color: rgba(255,255,255,0.22); }
.role-input:focus {
  border-color: rgba(99,102,241,0.5) !important;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
}
`;

const LEVELS = [
  { value: "junior", label: "Junior", desc: "0–2 yrs" },
  { value: "mid",    label: "Mid",    desc: "2–5 yrs" },
  { value: "senior", label: "Senior", desc: "5+ yrs"  },
];

const POPULAR_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Structures + Algorithms",
  "DevOps Engineer",
  "Machine Learning Engineer",
];

const SelectRoleInterview = () => {
  const navigate = useNavigate();
  const [role, setRole]   = useState("");
  const [level, setLevel] = useState("mid");

  const isValid = useMemo(() => role.trim().length > 1, [role]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    navigate("/ai-interview", { state: { role: role.trim(), level } });
  };

  return (
    <>
      <style>{STYLES}</style>

      <div
        className="min-h-screen text-white overflow-x-hidden"
        style={{ background: "#08080f", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
      >
        {/* BG grid */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="fixed top-0 left-1/4 w-[450px] h-[450px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="fixed bottom-0 right-1/4 w-[340px] h-[340px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />

        {/* NAVBAR */}
        <nav
          className="sticky top-0 z-40 border-b"
          style={{
            background: "rgba(8,8,15,0.88)",
            backdropFilter: "blur(24px)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border"
              style={{
                color: "rgba(255,255,255,0.55)",
                borderColor: "rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <UserButton />
          </div>
        </nav>

        {/* CONTENT */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <div className="max-w-xl mx-auto">

            {/* Badge */}
            <div
              className="fade-up fade-up-1 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 mb-4"
              style={{ background: "rgba(99,102,241,0.07)", borderColor: "rgba(99,102,241,0.25)" }}
            >
              <Bot className="size-3.5" style={{ color: "#818cf8" }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                AI Interview Prep
              </span>
            </div>

            {/* Heading */}
            <h1 className="fade-up fade-up-2 font-black text-2xl sm:text-4xl mb-2 leading-tight">
              <span className="shimmer-text">Set Your Interview</span>
              <br />
              <span className="shimmer-text">Context</span>
            </h1>
            <p
              className="fade-up fade-up-2 text-sm sm:text-base mb-7"
              style={{ color: "rgba(255,255,255,0.42)", lineHeight: 1.7 }}
            >
              Pick your target role and seniority level. The AI will adapt questions accordingly.
            </p>

            {/* FORM CARD */}
            <form
              onSubmit={handleSubmit}
              className="fade-up fade-up-3 rounded-2xl border p-5 sm:p-6 mb-4"
              style={{
                background: "rgba(12,12,22,0.88)",
                borderColor: "rgba(99,102,241,0.2)",
                boxShadow: "0 20px 70px rgba(99,102,241,0.1)",
              }}
            >
              <div className="space-y-5">

                {/* Role input */}
                <div>
                  <label
                    className="text-xs font-bold uppercase tracking-wider mb-2 block"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    Job Role
                  </label>
                  <div className="relative">
                    <Briefcase
                      className="size-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    />
                    <input
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      list="roles-list"
                      placeholder="e.g. SDE-1 Backend Engineer"
                      className="role-input w-full h-11 rounded-xl pl-10 pr-3 border outline-none text-sm transition-all"
                      style={{
                        background: "rgba(0,0,0,0.35)",
                        color: "white",
                        borderColor: "rgba(255,255,255,0.1)",
                      }}
                    />
                    <datalist id="roles-list">
                      {POPULAR_ROLES.map((r) => (
                        <option key={r} value={r} />
                      ))}
                    </datalist>
                  </div>

                  {/* Quick-pick chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {POPULAR_ROLES.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className="text-[11px] px-2.5 py-1 rounded-full border transition-all"
                        style={{
                          background:
                            role === r
                              ? "rgba(99,102,241,0.22)"
                              : "rgba(255,255,255,0.04)",
                          borderColor:
                            role === r
                              ? "rgba(99,102,241,0.5)"
                              : "rgba(255,255,255,0.1)",
                          color:
                            role === r
                              ? "#818cf8"
                              : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level — custom toggle buttons, no native select */}
                <div>
                  <label
                    className="text-xs font-bold uppercase tracking-wider mb-2 block"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    Candidate Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {LEVELS.map(({ value, label, desc }) => {
                      const active = level === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setLevel(value)}
                          className="rounded-xl border py-3 flex flex-col items-center gap-0.5 transition-all"
                          style={{
                            background: active
                              ? "rgba(99,102,241,0.18)"
                              : "rgba(0,0,0,0.28)",
                            borderColor: active
                              ? "rgba(99,102,241,0.5)"
                              : "rgba(255,255,255,0.1)",
                            boxShadow: active
                              ? "0 0 18px rgba(99,102,241,0.18)"
                              : "none",
                          }}
                        >
                          <span
                            className="text-sm font-bold"
                            style={{ color: active ? "#818cf8" : "rgba(255,255,255,0.6)" }}
                          >
                            {label}
                          </span>
                          <span
                            className="text-[10px]"
                            style={{ color: active ? "rgba(129,140,248,0.7)" : "rgba(255,255,255,0.25)" }}
                          >
                            {desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!isValid}
                  className="w-full h-12 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: isValid
                      ? "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(34,197,94,0.95))"
                      : "rgba(255,255,255,0.07)",
                    color: isValid ? "white" : "rgba(255,255,255,0.25)",
                    cursor: isValid ? "pointer" : "not-allowed",
                    boxShadow: isValid ? "0 8px 28px rgba(99,102,241,0.28)" : "none",
                  }}
                >
                  <PlayCircle className="size-4" />
                  Start AI Interview
                </button>
              </div>
            </form>

            {/* HISTORY CARD */}
            <Link
              to="/interview-history"
              className="fade-up fade-up-4 flex items-center justify-between rounded-2xl border px-5 py-4 group transition-all"
              style={{
                background: "rgba(12,12,22,0.7)",
                borderColor: "rgba(52,211,153,0.15)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(52,211,153,0.45)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(52,211,153,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(52,211,153,0.15)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="size-9 rounded-xl flex items-center justify-center border shrink-0"
                  style={{
                    background: "rgba(52,211,153,0.1)",
                    borderColor: "rgba(52,211,153,0.25)",
                  }}
                >
                  <History className="size-4" style={{ color: "#34d399" }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Past Interviews</p>
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Review your scores and feedback
                  </p>
                </div>
              </div>
              <ArrowLeft
                className="size-4 rotate-180 transition-transform duration-200 group-hover:translate-x-1"
                style={{ color: "#34d399" }}
              />
            </Link>

          </div>
        </div>
      </div>
    </>
  );
};

export default SelectRoleInterview;