"use client";

import { useState, useMemo } from "react";
import type { StackBlueprint } from "@layered/types";
import { resolveStack } from "@layered/engine";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    <div className="min-h-screen bg-black text-zinc-50 flex flex-col">
      {/* Minimal Header */}
      <header className="px-8 pt-20 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block">
            <h1 className="text-[3.5rem] font-light tracking-tight leading-none mb-3">
              layered
            </h1>
            <div className="h-px bg-gradient-to-r from-zinc-800 to-transparent" />
          </div>
          <p className="text-zinc-500 text-lg mt-6 max-w-md font-light">
            Stack generation from intent
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Intent Selection - Minimal Segmented Control */}
            <div className="space-y-4">
              <div className="text-[0.6875rem] uppercase tracking-[0.15em] text-zinc-600 font-medium">
                Intent
              </div>
              <div className="inline-flex border border-zinc-800 rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIntent("saas")}
                  className={`px-8 py-3 text-sm font-medium transition-all ${
                    intent === "saas"
                      ? "bg-zinc-900 text-zinc-50"
                      : "bg-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  SaaS
                </button>
                <div className="w-px bg-zinc-800" />
                <button
                  type="button"
                  onClick={() => setIntent("api")}
                  className={`px-8 py-3 text-sm font-medium transition-all ${
                    intent === "api"
                      ? "bg-zinc-900 text-zinc-50"
                      : "bg-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  API
                </button>
              </div>
            </div>

            <Separator className="bg-zinc-900" />

            {/* Stack Options - Ultra Minimal Grid */}
            <div className="grid grid-cols-2 gap-x-16 gap-y-8">
              {/* Frontend */}
              <button
                type="button"
                onClick={() => setFrontend(!frontend)}
                className="group text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    Frontend
                  </span>
                  <div
                    className={`w-8 h-[1px] transition-all ${
                      frontend ? "bg-zinc-50" : "bg-zinc-800"
                    }`}
                  />
                </div>
                <div
                  className={`text-base font-light transition-colors ${
                    frontend ? "text-zinc-50" : "text-zinc-600"
                  }`}
                >
                  {frontend ? "Next.js" : "None"}
                </div>
              </button>

              {/* Backend */}
              <button
                type="button"
                onClick={() => setBackend(backend === "node" ? null : "node")}
                className="group text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    Backend
                  </span>
                  <div
                    className={`w-8 h-[1px] transition-all ${
                      backend ? "bg-zinc-50" : "bg-zinc-800"
                    }`}
                  />
                </div>
                <div
                  className={`text-base font-light transition-colors ${
                    backend ? "text-zinc-50" : "text-zinc-600"
                  }`}
                >
                  {backend === "node"
                    ? "Node.js"
                    : backend === "fastapi"
                    ? "FastAPI"
                    : "None"}
                </div>
              </button>

              {/* Database */}
              <button
                type="button"
                onClick={() => setDatabase(!database)}
                className="group text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    Database
                  </span>
                  <div
                    className={`w-8 h-[1px] transition-all ${
                      database ? "bg-zinc-50" : "bg-zinc-800"
                    }`}
                  />
                </div>
                <div
                  className={`text-base font-light transition-colors ${
                    database ? "text-zinc-50" : "text-zinc-600"
                  }`}
                >
                  {database ? "PostgreSQL" : "None"}
                </div>
              </button>

              {/* Auth */}
              <button
                type="button"
                onClick={() => setAuth(!auth)}
                className="group text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    Auth
                  </span>
                  <div
                    className={`w-8 h-[1px] transition-all ${
                      auth ? "bg-zinc-50" : "bg-zinc-800"
                    }`}
                  />
                </div>
                <div
                  className={`text-base font-light transition-colors ${
                    auth ? "text-zinc-50" : "text-zinc-600"
                  }`}
                >
                  {auth ? "Auth.js" : "None"}
                </div>
              </button>
            </div>

            <Separator className="bg-zinc-900" />

            {/* Resolved Stack Preview */}
            <div className="space-y-4">
              <div className="text-[0.6875rem] uppercase tracking-[0.15em] text-zinc-600 font-medium">
                Stack
              </div>
              <div className="font-mono text-[0.8125rem] space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-600 w-20">intent</span>
                  <span className="text-zinc-500">→</span>
                  <span className="text-zinc-300">{resolvedStack.intent}</span>
                </div>
                {resolvedStack.frontend && (
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-600 w-20">frontend</span>
                    <span className="text-zinc-500">→</span>
                    <span className="text-zinc-300">
                      {resolvedStack.frontend}
                    </span>
                    {frontend && !backend && (
                      <Badge
                        variant="outline"
                        className="text-[0.625rem] font-normal border-zinc-800 text-zinc-500"
                      >
                        +backend
                      </Badge>
                    )}
                  </div>
                )}
                {resolvedStack.backend && (
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-600 w-20">backend</span>
                    <span className="text-zinc-500">→</span>
                    <span className="text-zinc-300">
                      {resolvedStack.backend}
                    </span>
                  </div>
                )}
                {resolvedStack.database && (
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-600 w-20">database</span>
                    <span className="text-zinc-500">→</span>
                    <span className="text-zinc-300">
                      {resolvedStack.database}
                    </span>
                    {auth && !database && (
                      <Badge
                        variant="outline"
                        className="text-[0.625rem] font-normal border-zinc-800 text-zinc-500"
                      >
                        auto
                      </Badge>
                    )}
                  </div>
                )}
                {resolvedStack.auth && (
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-600 w-20">auth</span>
                    <span className="text-zinc-500">→</span>
                    <span className="text-zinc-300">{resolvedStack.auth}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="border border-red-900/50 bg-red-950/20 px-6 py-4 rounded text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Success State */}
            {success && (
              <div className="border border-emerald-900/50 bg-emerald-950/20 px-6 py-4 rounded space-y-3">
                <div className="text-sm text-emerald-300">
                  Stack generated · layered-stack.zip
                </div>
                <div className="font-mono text-xs text-zinc-500 flex items-center justify-between bg-black/40 px-3 py-2 rounded">
                  <code>docker compose up</code>
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText("docker compose up")
                    }
                    className="text-zinc-600 hover:text-zinc-400 transition-colors text-[0.625rem] uppercase tracking-wider"
                  >
                    copy
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-8">
              <Button
                type="submit"
                disabled={loading}
                className="bg-zinc-50 text-black hover:bg-zinc-200 font-medium h-11 px-8 rounded"
              >
                {loading ? "Generating..." : "Generate"}
              </Button>
              {(frontend || backend || database || auth) && !success && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-zinc-600">
          <div>Built for developers</div>
          <a
            href="https://github.com"
            className="hover:text-zinc-400 transition-colors"
          >
            Source
          </a>
        </div>
      </footer>
    </div>
  );
}
