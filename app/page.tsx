"use client";

import { useState, useEffect, useRef } from "react";
import type { StackBlueprint } from "@layered/types";
import { resolveStack } from "@layered/engine";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Message {
  role: "user" | "assistant";
  content: string;
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

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);

      // Handle actions
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
        // Generate and download
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
    <div className="h-screen bg-[#1a1a1a] text-zinc-50 flex">
      {/* Sidebar */}
      <div className="w-48 bg-[#111] border-r border-zinc-800 flex flex-col">
        <div className="p-4">
          <Button
            onClick={handleNewChat}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            New Chat
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h1 className="text-4xl font-light mb-4">
                  How can I help you?
                </h1>
                <p className="text-zinc-500 mb-8">
                  Tell me what you're building and I'll configure your stack
                </p>
                <div className="grid grid-cols-2 gap-3 max-w-xl w-full">
                  <button
                    onClick={() =>
                      setInput("I'm building a SaaS app with authentication")
                    }
                    className="p-4 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-left text-sm transition-colors"
                  >
                    I'm building a SaaS app with authentication
                  </button>
                  <button
                    onClick={() =>
                      setInput("I need a Next.js frontend with Node backend")
                    }
                    className="p-4 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-left text-sm transition-colors"
                  >
                    I need a Next.js frontend with Node backend
                  </button>
                  <button
                    onClick={() => setInput("Add PostgreSQL database")}
                    className="p-4 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-left text-sm transition-colors"
                  >
                    Add PostgreSQL database
                  </button>
                  <button
                    onClick={() => setInput("API-only service")}
                    className="p-4 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-left text-sm transition-colors"
                  >
                    API-only service
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-zinc-800 text-zinc-100"
                          : "bg-zinc-900 text-zinc-300"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-900 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-zinc-800 p-6">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-700"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-zinc-800 hover:bg-zinc-700 px-6"
              >
                Send
              </Button>
            </form>
            <p className="text-xs text-zinc-600 mt-3 text-center">
              Say "download" when you're ready to generate your stack
            </p>
          </div>
        </div>
      </div>

      {/* Stack Preview Sidebar */}
      <div className="w-72 bg-[#111] border-l border-zinc-800 p-6">
        <div className="mb-6">
          <h2 className="text-xs uppercase tracking-wider text-zinc-600 mb-4">
            Current Stack
          </h2>
          <Separator className="bg-zinc-800 mb-4" />
        </div>

        <div className="space-y-3 font-mono text-sm">
          <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded border border-zinc-800 transition-all duration-300">
            <span className="text-zinc-500">intent</span>
            <span className="text-zinc-300">{resolvedStack.intent}</span>
          </div>

          {resolvedStack.frontend && (
            <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded border border-zinc-800 transition-all duration-300 animate-in fade-in slide-in-from-right-2">
              <span className="text-zinc-500">frontend</span>
              <span className="text-zinc-300">{resolvedStack.frontend}</span>
            </div>
          )}

          {resolvedStack.backend && (
            <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded border border-zinc-800 transition-all duration-300 animate-in fade-in slide-in-from-right-2">
              <span className="text-zinc-500">backend</span>
              <span className="text-zinc-300">{resolvedStack.backend}</span>
            </div>
          )}

          {resolvedStack.database && (
            <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded border border-zinc-800 transition-all duration-300 animate-in fade-in slide-in-from-right-2">
              <span className="text-zinc-500">database</span>
              <span className="text-zinc-300">{resolvedStack.database}</span>
            </div>
          )}

          {resolvedStack.auth && (
            <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded border border-zinc-800 transition-all duration-300 animate-in fade-in slide-in-from-right-2">
              <span className="text-zinc-500">auth</span>
              <span className="text-zinc-300">{resolvedStack.auth}</span>
            </div>
          )}
        </div>

        {Object.keys(resolvedStack).length > 1 && (
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <Button
              onClick={() => setInput("download my stack")}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Download Stack
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
