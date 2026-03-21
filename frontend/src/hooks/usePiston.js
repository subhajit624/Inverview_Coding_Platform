const BASE_URL = import.meta.env.VITE_BACKEND_URL.replace(/\/api\/?$/, '');

export async function runOnPiston(code, language, testCases) {
  const results = [];

  for (const tc of testCases) {
    try {
      const res = await fetch(`${BASE_URL}/api/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, stdin: tc.input })
      });

      const data   = await res.json();
      const actual = (data.output || "").trim();
      const stderr = (data.error  || "").trim();

      results.push({
        input:    tc.input,
        expected: tc.expected,
        actual:   stderr ? "Runtime Error: " + stderr : actual,
        passed:   !stderr && actual === tc.expected.trim()
      });

    } catch (err) {
      results.push({
        input:    tc.input,
        expected: tc.expected,
        actual:   "Network Error — is server running?",
        passed:   false
      });
    }
  }

  return results;
}