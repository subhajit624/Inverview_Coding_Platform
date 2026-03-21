import { Link } from "react-router-dom";
import { Code2, ArrowRight, BookOpen } from "lucide-react";
import { UserButton, useUser } from "@clerk/react";

const Dashboard = () => {
  const { user } = useUser();

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#08080f", fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      {/* BG GRID */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
      <div className="fixed top-0 left-1/3 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="fixed bottom-1/3 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b"
        style={{ background: "rgba(8,8,15,0.85)", backdropFilter: "blur(24px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #22c55e)" }}>
              <Code2 className="size-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "'Courier New', monospace" }}>
              Crack<span style={{ color: "#818cf8" }}>It</span>
            </span>
          </Link>
          <UserButton />
        </div>
      </nav>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-6 py-16 relative">

        {/* Welcome */}
        <div className="mb-12">
          <p className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Welcome back</p>
          <h1 className="text-4xl font-black tracking-tight">
            {user?.firstName || "Coder"} 👋
          </h1>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Problems */}
          <Link to="/problems"
            className="group rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1"
            style={{ background: "rgba(12,12,22,0.8)", borderColor: "rgba(99,102,241,0.2)" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"}
          >
            <div className="size-11 rounded-xl flex items-center justify-center mb-4 border"
              style={{ background: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.2)" }}>
              <BookOpen className="size-5" style={{ color: "#818cf8" }} />
            </div>
            <h2 className="font-bold text-base mb-1">Problems</h2>
            <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              Solve DSA problems across Easy, Medium and Hard.
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#818cf8" }}>
              Go to Problems <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* More cards — add yours here */}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;