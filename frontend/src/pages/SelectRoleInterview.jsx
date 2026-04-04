import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserButton } from "@clerk/react";
import { ArrowLeft, Bot, Briefcase, PlayCircle } from "lucide-react";

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
.shimmer-text {
  background: linear-gradient(90deg, #818cf8 0%, #34d399 45%, #818cf8 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
`;

const popularRoles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Structures + Algorithms",
  "DevOps Engineer",
  "Machine Learning Engineer",
];

const SelectRoleInterview = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("mid");

  const isValid = useMemo(() => role.trim().length > 1, [role]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) return;

    navigate("/ai-interview", {
      state: {
        role: role.trim(),
        level,
      },
    });
  };

  return (
    <>
      <style>{STYLES}</style>

      <div
        className="min-h-screen text-white overflow-x-hidden"
        style={{ background: "#08080f", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
      >
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
            background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
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

        <nav
          className="sticky top-0 z-40 border-b"
          style={{
            background: "rgba(8,8,15,0.88)",
            backdropFilter: "blur(24px)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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
              Back to Dashboard
            </Link>
            <UserButton />
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="max-w-2xl mx-auto">
            <div
              className="fade-up fade-up-1 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 mb-5"
              style={{ background: "rgba(99,102,241,0.07)", borderColor: "rgba(99,102,241,0.25)" }}
            >
              <Bot className="size-3.5" style={{ color: "#818cf8" }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                AI Interview Prep
              </span>
            </div>

            <h1 className="fade-up fade-up-2 font-black text-3xl sm:text-4xl mb-2">
              <span className="shimmer-text">Set Your Interview Context</span>
            </h1>
            <p
              className="fade-up fade-up-2 text-sm sm:text-base mb-8"
              style={{ color: "rgba(255,255,255,0.42)" }}
            >
              Pick your target role and seniority level. The AI interviewer will adapt the questions accordingly.
            </p>

            <form
              onSubmit={handleSubmit}
              className="fade-up fade-up-3 rounded-2xl border p-5 sm:p-6"
              style={{
                background: "rgba(12,12,22,0.88)",
                borderColor: "rgba(99,102,241,0.2)",
                boxShadow: "0 20px 70px rgba(99,102,241,0.12)",
              }}
            >
              <div className="space-y-5">
                <div>
                  <label
                    className="text-xs font-bold uppercase tracking-wider mb-2 block"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    Job Role
                  </label>
                  <div className="relative">
                    <Briefcase
                      className="size-4 absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    />
                    <input
                      value={role}
                      onChange={(event) => setRole(event.target.value)}
                      list="roles"
                      placeholder="e.g. SDE-1 Backend Engineer"
                      className="w-full h-11 rounded-xl pl-10 pr-3 border outline-none text-sm"
                      style={{
                        background: "rgba(0,0,0,0.28)",
                        color: "white",
                        borderColor: "rgba(255,255,255,0.12)",
                      }}
                    />
                    <datalist id="roles">
                      {popularRoles.map((item) => (
                        <option key={item} value={item} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div>
                  <label
                    className="text-xs font-bold uppercase tracking-wider mb-2 block"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    Candidate Level
                  </label>
                  <select
                    value={level}
                    onChange={(event) => setLevel(event.target.value)}
                    className="w-full h-11 rounded-xl px-3 border outline-none text-sm"
                    style={{
                      background: "rgba(0,0,0,0.28)",
                      color: "white",
                      borderColor: "rgba(255,255,255,0.12)",
                    }}
                  >
                    <option value="junior">Junior</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!isValid}
                  className="w-full h-11 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: isValid
                      ? "linear-gradient(135deg, rgba(99,102,241,0.92), rgba(34,197,94,0.92))"
                      : "rgba(255,255,255,0.1)",
                    color: isValid ? "white" : "rgba(255,255,255,0.35)",
                    cursor: isValid ? "pointer" : "not-allowed",
                  }}
                >
                  <PlayCircle className="size-4" />
                  Start AI Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectRoleInterview;
