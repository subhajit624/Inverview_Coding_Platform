import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import { clerkMiddleware } from "@clerk/express";
import { protectedRoute } from "./middleware/protectedRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = express();
const __dirname = path.resolve();

// middlewares
app.use(express.json());
app.use(cors({
    origin: ENV.FRONTEND_URL,
    credentials: true
}));
app.use(clerkMiddleware());

// routes for inngest functions
app.use("/api/inngest", serve({ client: inngest, functions }));

// ── CODE EXECUTION PROXY ─────────────────────────────────────────────────────
const LANG_MAP = {
  python:     "python-3.14",    // ✅ exact id from /api/compilers
  javascript: "typescript-deno", // ✅ no nodejs available, deno it is
  java:       "openjdk-25",     // ✅ exact id from /api/compilers
};

// ← DEBUG: open http://localhost:PORT/api/compilers in browser to see exact compiler strings
// app.get("/api/compilers", async (req, res) => { // this part is not needed, its to check available compilers and their ids
//   const response = await fetch("https://api.onlinecompiler.io/api/compilers/", {
//     headers: { "Authorization": ENV.ONLINE_COMPILER_API_KEY }
//   });
//   const data = await response.json();
//   res.json(data);
// });

app.post("/api/execute", async (req, res) => {
  const { code, language, stdin } = req.body;

  try {
    const response = await fetch("https://api.onlinecompiler.io/api/run-code-sync/", {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": ENV.ONLINE_COMPILER_API_KEY,
      },
      body: JSON.stringify({
        compiler: LANG_MAP[language],
        code,
        input: stdin,   // ← was "stdin", onlinecompiler.io expects "input"
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ output: "", error: err.message });
  }
});
// ─────────────────────────────────────────────────────────────────────────────

// routes
app.use('/api/chat', chatRoutes);
app.use("/api/session", sessionRoutes);

// production
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log(`Server is running on port ${ENV.PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();