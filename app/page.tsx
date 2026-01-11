"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { StackBlueprint } from "@layered/types";
import { STACK_CONFIG } from "@layered/types";
import { resolveStack } from "@layered/engine";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getTechIcon } from "@/lib/icons";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function StackArtifact({ stack }: { stack: StackBlueprint }) {
  const items = [
    { key: "frontend", label: "Frontend", value: stack.frontend },
    { key: "backend", label: "Backend", value: stack.backend },
    { key: "database", label: "Database", value: stack.database },
    { key: "auth", label: "Auth", value: stack.auth },
  ].filter((item) => item.value);

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const categoryKey = item.key as keyof typeof STACK_CONFIG;
        const categoryConfig = STACK_CONFIG[categoryKey];
        let iconKey: string | undefined;
        
        if (categoryConfig && item.value) {
          const options = categoryConfig.options as Record<string, any>;
          const optionConfig = options?.[item.value];
          iconKey = optionConfig?.icon;
        }

        return (
          <div
            key={item.key}
            className="flex items-center gap-3 p-3 rounded-lg bg-[#0d0d0d] border border-[#2a2a2a]"
          >
            {iconKey && (
              <div className="text-[#0088ff]">
                <Image
                  src={getTechIcon(iconKey) as string}
                  alt={item.value || ""}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                  unoptimized
                />
              </div>
            )}
            <div className="flex-1">
              <div className="text-xs text-[#666666] uppercase tracking-wider">{item.label}</div>
              <div className="text-sm font-medium text-[#e0e0e0]">{item.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stack, setStack] = useState<StackBlueprint>({ intent: "saas" });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const resolvedStack = resolveStack(stack);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, currentStack: stack }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);

      if (data.action === "modify" && data.changes) {
        setStack((prev) => {
          const updated = { ...prev };
          Object.entries(data.changes).forEach(([key, value]) => {
            if (value === null) {
              delete updated[key as keyof StackBlueprint];
            } else if (value !== undefined) {
              (updated as any)[key] = value;
            }
          });
          return updated;
        });
      } else if (data.action === "download") {
        const genResponse = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resolvedStack),
        });

        if (genResponse.ok) {
          const blob = await genResponse.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "layered-stack.zip";
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "✓ Stack downloaded as layered-stack.zip",
            },
          ]);
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setStack({ intent: "saas" });
  };

  return (
    <div className="h-screen bg-[#0d0d0d] text-[#e0e0e0] flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-[#111111] border-r border-[#2a2a2a] flex flex-col">
        {/* New Chat Button */}
        <div className="p-3 border-b border-[#2a2a2a]">
          <Button 
            onClick={handleNewChat} 
            className="w-full justify-start bg-[#1a1a1a] hover:bg-[#222222] text-[#e0e0e0] border border-[#2a2a2a]"
            variant="outline"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
            </svg>
            New Chat
          </Button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-[#2a2a2a]">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-[#d0d0d0] placeholder:text-[#666666] focus:outline-none focus:border-[#3a3a3a]"
          />
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {[
            { label: "Projects", icon: "📁" },
            { label: "Recents", icon: "⏱" },
            { label: "Design Systems", icon: "🎨" },
            { label: "Templates", icon: "📋" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full px-3 py-2 rounded-lg text-left text-sm hover:bg-[#1a1a1a] text-[#d0d0d0] flex items-center gap-2"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div className="my-3">
            <Separator className="bg-[#2a2a2a]" />
          </div>

          <div className="px-3 py-2 text-xs font-semibold text-[#666666] uppercase tracking-wider">
            Favorites
          </div>

          <div className="px-3 py-2 text-xs font-semibold text-[#666666] uppercase tracking-wider mt-4">
            Recents
          </div>

          {["SaaS Builder", "API Generator", "Full-Stack Kit"].map((name) => (
            <button
              key={name}
              className="w-full px-3 py-2 rounded-lg text-left text-sm hover:bg-[#1a1a1a] text-[#d0d0d0] truncate"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-8 w-full max-w-2xl px-4">
                <div className="space-y-4">
                  <h1 className="text-5xl font-semibold">How can I help you?</h1>
                  <p className="text-[#999999]">Tell me what stack you want to build</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "SaaS App", subtitle: "with authentication" },
                    { title: "Full-Stack", subtitle: "Next.js + Node.js" },
                    { title: "API Service", subtitle: "Backend only" },
                    { title: "Add Database", subtitle: "PostgreSQL" },
                  ].map((item) => (
                    <button
                      key={item.title}
                      onClick={() => setInput(item.title)}
                      className="p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] text-left transition-colors"
                    >
                      <div className="text-sm font-medium text-[#e0e0e0]">{item.title}</div>
                      <div className="text-xs text-[#666666] mt-1">{item.subtitle}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx}>
                  <div
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`rounded-xl px-4 py-3 max-w-[70%] ${
                        msg.role === "user"
                          ? "bg-[#0088ff] text-white"
                          : "bg-[#1a1a1a] text-[#d0d0d0] border border-[#2a2a2a]"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                  
                  {/* Artifact Card - Show when stack changes */}
                  {msg.role === "assistant" && 
                   Object.keys(resolvedStack).length > 1 && 
                   idx === messages.length - 1 && (
                    <div className="mt-4">
                      <div className="border border-[#3a3a3a] rounded-xl bg-[#1a1a1a] overflow-hidden">
                        <div className="bg-[#252525] border-b border-[#3a3a3a] px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#0088ff]" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            <span className="text-sm font-medium text-[#e0e0e0]">Stack Configuration</span>
                          </div>
                        </div>
                        <div className="p-4 space-y-3">
                          <StackArtifact stack={resolvedStack} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-[#666666] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#666666] rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-[#666666] rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-[#2a2a2a] bg-[#0d0d0d] px-4 py-4">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a follow-up..."
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 pr-12 text-sm text-[#d0d0d0] placeholder:text-[#666666] focus:outline-none focus:border-[#3a3a3a] focus:ring-1 focus:ring-[#3a3a3a]"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0088ff] hover:bg-[#0066cc] text-white rounded-lg h-8 w-8"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5M5 12h14" />
                </svg>
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Stack Info */}
      <div className="w-80 bg-[#111111] border-l border-[#2a2a2a] flex flex-col">
        <div className="p-4 border-b border-[#2a2a2a]">
          <h2 className="text-sm font-semibold text-[#e0e0e0]">Current Stack</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#666666]">intent</span>
              <span className="text-xs font-mono font-medium text-[#0088ff]">{resolvedStack.intent}</span>
            </div>
          </div>

          {resolvedStack.frontend && (
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 animate-in fade-in slide-in-from-right-2 group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-xs text-[#666666]">frontend</span>
                  <div className="text-xs font-mono font-medium text-[#0088ff]">{resolvedStack.frontend}</div>
                </div>
                <button
                  onClick={() => setStack((prev) => ({ ...prev, frontend: undefined }))}
                  className="ml-2 p-1.5 rounded text-[#666666] hover:text-red-500 hover:bg-[#2a2a2a] opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove frontend"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {resolvedStack.backend && (
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 animate-in fade-in slide-in-from-right-2 group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-xs text-[#666666]">backend</span>
                  <div className="text-xs font-mono font-medium text-[#0088ff]">{resolvedStack.backend}</div>
                </div>
                <button
                  onClick={() => setStack((prev) => ({ ...prev, backend: undefined }))}
                  className="ml-2 p-1.5 rounded text-[#666666] hover:text-red-500 hover:bg-[#2a2a2a] opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove backend"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {resolvedStack.database && (
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 animate-in fade-in slide-in-from-right-2 group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-xs text-[#666666]">database</span>
                  <div className="text-xs font-mono font-medium text-[#0088ff]">{resolvedStack.database}</div>
                </div>
                <button
                  onClick={() => setStack((prev) => ({ ...prev, database: undefined }))}
                  className="ml-2 p-1.5 rounded text-[#666666] hover:text-red-500 hover:bg-[#2a2a2a] opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove database"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {resolvedStack.auth && (
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 animate-in fade-in slide-in-from-right-2 group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-xs text-[#666666]">auth</span>
                  <div className="text-xs font-mono font-medium text-[#0088ff]">{resolvedStack.auth}</div>
                </div>
                <button
                  onClick={() => setStack((prev) => ({ ...prev, auth: undefined }))}
                  className="ml-2 p-1.5 rounded text-[#666666] hover:text-red-500 hover:bg-[#2a2a2a] opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove auth"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {Object.keys(resolvedStack).length > 1 && (
          <div className="p-3 border-t border-[#2a2a2a]">
            <Button
              onClick={() => setInput("download my stack")}
              className="w-full bg-[#0088ff] hover:bg-[#0066cc] text-white"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Stack
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
