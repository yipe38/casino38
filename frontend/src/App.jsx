// frontend/src/App.jsx
import { useMemo, useState } from "react";

export default function App() {
  const defaultBase = useMemo(
    () => import.meta.env.VITE_API_BASE || "http://localhost:3000",
    []
  );
  const [baseUrl, setBaseUrl] = useState(defaultBase);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function checkHealth() {
    setLoading(true);
    setErr("");
    setResult(null);
    try {
      const res = await fetch(`${baseUrl.replace(/\/$/, "")}/health`);
      const data = await res.json();
      setResult({ status: res.status, body: data });
    } catch (e) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px",
        color: "#eaeaea",
        background: "#1f1f1f",
        fontFamily: "system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginTop: 0 }}>Hello Casino38 👋</h1>

      <section
        style={{
          display: "grid",
          gap: "12px",
          maxWidth: 640,
          alignItems: "start",
        }}
      >
        <label style={{ fontSize: 14, opacity: 0.9 }}>
          Backend-URL (Basis):
        </label>
        <input
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="http://localhost:3000"
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid #3a3a3a",
            background: "#2a2a2a",
            color: "#fff",
            outline: "none",
          }}
        />

        <button
          onClick={checkHealth}
          disabled={loading}
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            border: "none",
            background: loading ? "#3a3a3a" : "#4f46e5",
            color: "#fff",
            cursor: loading ? "default" : "pointer",
            fontWeight: 600,
            width: "fit-content",
          }}
        >
          {loading ? "Prüfe ..." : "API-Call: GET /health"}
        </button>

        {err && (
          <div
            style={{
              marginTop: 8,
              padding: "10px 12px",
              borderRadius: 12,
              background: "#3a1f1f",
              border: "1px solid #7a2f2f",
              whiteSpace: "pre-wrap",
            }}
          >
            ❌ Fehler: {err}
          </div>
        )}

        {result && (
          <div
            style={{
              marginTop: 8,
              padding: "10px 12px",
              borderRadius: 12,
              background: "#1f2f1f",
              border: "1px solid #2f7a2f",
              whiteSpace: "pre-wrap",
            }}
          >
            ✅ HTTP {result.status}
            {"\n"}
            {JSON.stringify(result.body, null, 2)}
          </div>
        )}
      </section>
    </main>
  );
}
