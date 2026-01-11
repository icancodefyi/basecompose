"use client";

import { useState, useMemo } from "react";
import type { StackBlueprint } from "@layered/types";
import { resolveStack } from "@layered/engine";

export default function Home() {
  const [intent, setIntent] = useState<"saas" | "api">("saas");
  const [frontend, setFrontend] = useState(false);
  const [backend, setBackend] = useState<"node" | "fastapi" | null>(null);
  const [database, setDatabase] = useState(false);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live preview
  const resolvedStack = useMemo(() => {
    const blueprint: StackBlueprint = {
      intent,
      ...(frontend && { frontend: "nextjs" }),
      ...(backend && { backend }),
      ...(database && { database: "postgres" }),
      ...(auth && { auth: "authjs" }),
    };
    return resolveStack(blueprint);
  }, [intent, frontend, backend, database, auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const blueprint: StackBlueprint = {
      intent,
      ...(frontend && { frontend: "nextjs" }),
      ...(backend && { backend }),
      ...(database && { database: "postgres" }),
      ...(auth && { auth: "authjs" }),
    };

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blueprint),
      });

      if (!response.ok) {
        throw new Error("Failed to generate stack");
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "layered-stack.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIntent("saas");
    setFrontend(false);
    setBackend(null);
    setDatabase(false);
    setAuth(false);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Hero Section */}
      <div className="pt-16 pb-12 px-6 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
            layered
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
            Generate a production-ready stack from intent.
          </p>
          <p className="text-lg text-slate-500 mt-2">
            Choose what you're building. We'll wire the rest.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800 px-6 sm:px-8 mb-12">
        <div className="max-w-3xl mx-auto" />
      </div>

      {/* Main Content */}
      <div className="px-6 sm:px-8 pb-24">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Card 1: Intent */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-6">
                What are you building?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => setIntent("saas")}
                  className={`flex-1 px-6 py-4 rounded-lg font-medium transition-all duration-200 ${
                    intent === "saas"
                      ? "bg-blue-600 text-white border border-blue-500"
                      : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <div className="font-semibold">SaaS App</div>
                  <div className="text-sm text-slate-400 mt-1">
                    Frontend, backend & auth
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setIntent("api")}
                  className={`flex-1 px-6 py-4 rounded-lg font-medium transition-all duration-200 ${
                    intent === "api"
                      ? "bg-blue-600 text-white border border-blue-500"
                      : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <div className="font-semibold">API Only</div>
                  <div className="text-sm text-slate-400 mt-1">
                    Backend service
                  </div>
                </button>
              </div>
            </div>

            {/* Card 2: Frontend */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-6">
                Frontend (Optional)
              </h2>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFrontend(!frontend)}
                  className={`flex-1 px-6 py-4 rounded-lg font-medium transition-all duration-200 ${
                    frontend
                      ? "bg-blue-600 text-white border border-blue-500"
                      : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600"
                  }`}
                >
                  Next.js
                </button>
                <button
                  type="button"
                  onClick={() => setFrontend(false)}
                  className={`flex-1 px-6 py-4 rounded-lg font-medium transition-all duration-200 ${
                    !frontend
                      ? "bg-blue-600 text-white border border-blue-500"
                      : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600"
                  }`}
                >
                  None
                </button>
              </div>
              {frontend && (
                <p className="text-sm text-slate-400 mt-4 flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">→</span>
                  Auto-selects Node.js backend for compatibility
                </p>
              )}
            </div>

            {/* Card 3: Backend */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-6">
                Backend (Optional)
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 rounded-lg border border-slate-700 hover:border-slate-600 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={backend === "node"}
                    onChange={(e) =>
                      setBackend(e.target.checked ? "node" : null)
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="ml-3 font-medium">Node.js</span>
                </label>
                <label className="flex items-center p-4 rounded-lg border border-slate-700 hover:border-slate-600 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={backend === "fastapi"}
                    onChange={(e) =>
                      setBackend(e.target.checked ? "fastapi" : null)
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="ml-3 font-medium">FastAPI</span>
                </label>
              </div>
            </div>

            {/* Card 4: Database */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-6">
                Database (Optional)
              </h2>
              <label className="flex items-center p-4 rounded-lg border border-slate-700 hover:border-slate-600 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={database}
                  onChange={(e) => setDatabase(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="ml-3 font-medium">PostgreSQL</span>
              </label>
            </div>

            {/* Card 5: Auth */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-6">
                Authentication (Optional)
              </h2>
              <label className="flex items-center p-4 rounded-lg border border-slate-700 hover:border-slate-600 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={auth}
                  onChange={(e) => setAuth(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="ml-3 font-medium">Auth.js</span>
              </label>
              {auth && (
                <p className="text-sm text-slate-400 mt-4 flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">→</span>
                  Requires PostgreSQL (will be added automatically)
                </p>
              )}
            </div>

            {/* Live Stack Preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-6">
                Resolved Stack
              </h2>
              <div className="font-mono text-sm space-y-3 text-slate-300">
                <div className="flex justify-between items-start">
                  <span className="text-slate-500">Intent:</span>
                  <span className="text-slate-100 font-semibold">
                    {resolvedStack.intent}
                  </span>
                </div>
                {resolvedStack.frontend && (
                  <div className="flex justify-between items-start">
                    <span className="text-slate-500">Frontend:</span>
                    <span className="text-slate-100 font-semibold">
                      {resolvedStack.frontend}
                    </span>
                  </div>
                )}
                {resolvedStack.backend && (
                  <div className="flex justify-between items-start">
                    <span className="text-slate-500">Backend:</span>
                    <span className="text-slate-100 font-semibold">
                      {resolvedStack.backend}
                    </span>
                  </div>
                )}
                {resolvedStack.database && (
                  <div className="flex justify-between items-start">
                    <span className="text-slate-500">Database:</span>
                    <span className="text-slate-100 font-semibold">
                      {resolvedStack.database}
                    </span>
                  </div>
                )}
                {resolvedStack.auth && (
                  <div className="flex justify-between items-start">
                    <span className="text-slate-500">Auth:</span>
                    <span className="text-slate-100 font-semibold">
                      {resolvedStack.auth}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-200">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <div className="font-semibold text-green-200 mb-2">
                      Stack generated successfully
                    </div>
                    <div className="text-sm text-green-300 mb-3">
                      Your <code className="bg-slate-800 px-2 py-1 rounded">layered-stack.zip</code> is ready.
                    </div>
                    <div className="bg-slate-800 rounded p-3 text-slate-300 font-mono text-sm">
                      <div className="flex items-center justify-between">
                        <span>docker compose up</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText("docker compose up");
                          }}
                          className="text-slate-500 hover:text-slate-300 text-xs"
                        >
                          copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-blue-400 border-t-blue-200 rounded-full animate-spin" />
                    Assembling layers…
                  </span>
                ) : (
                  "Generate Stack"
                )}
              </button>
              {!success && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-4 px-6 rounded-lg transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 px-6 sm:px-8 py-12">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div>Built for developers.</div>
          <a
            href="https://github.com"
            className="hover:text-slate-400 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
