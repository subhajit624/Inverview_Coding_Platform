import { ENV } from "../lib/env.js";

// ── CODE EXECUTION PROXY ─────────────────────────────────────────────────────
const LANG_MAP = {
  python:     "python-3.14",    // ✅ exact id from /api/compilers
  javascript: "typescript-deno", // ✅ no nodejs available, deno it is
  java:       "openjdk-25",     // ✅ exact id from /api/compilers
};

export const executeCode = async(req, res) => {
  const { code, language, stdin } = req.body;

  try {
    const response = await fetch("https://api.onlinecompiler.io/api/run-code-sync", {
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
}