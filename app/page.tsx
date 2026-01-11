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
    <div className="h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-semibold">Layered</h1>
        </div>
        <div className="p-4">
          <Button
            onClick={handleNewChat}
            className="w-full"
            size="lg"
          >
            New Chat
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-12 py-8">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h1 className="text-5xl font-semibold mb-6">
                  How can I help you?
                </h1>
                <p className="text-muted-foreground text-lg mb-12">
                  Tell me what you're building and I'll configure your stack
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-2xl w-full">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() =>
                      setInput("I'm building a SaaS app with authentication")
                    }
                    className="h-auto p-6 text-left justify-start"
                  >
                    <p className="text-sm font-medium">I'm building a SaaS app with authentication</p>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() =>
                      setInput("I need a Next.js frontend with Node backend")
                    }
                    className="h-auto p-6 text-left justify-start"
                  >
                    <p className="text-sm font-medium">I need a Next.js frontend with Node backend</p>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setInput("Add PostgreSQL database")}
                    className="h-auto p-6 text-left justify-start"
                  >
                    <p className="text-sm font-medium">Add PostgreSQL database</p>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setInput("API-only service")}
                    className="h-auto p-6 text-left justify-start"
                  >
                    <p className="text-sm font-medium">API-only service</p>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-5 py-4 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted border border-border"
                      }`}
                    >
                      <p className="text-[15px] leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-muted border border-border rounded-2xl px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
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
        <div className="border-t border-border p-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-center gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 bg-input border border-border rounded-xl px-5 py-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition-all"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                size="lg"
                className="px-8"
              >
                Send
              </Button>
            </form>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Say "download" when you're ready to generate your stack
            </p>
          </div>
        </div>
      </div>

      {/* Stack Preview Sidebar */}
      <div className="w-80 bg-card border-l border-border p-8">
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-4">
            Current Stack
          </h2>
          <Separator />
        </div>

        <div className="space-y-3 font-mono text-sm">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border transition-all duration-300">
            <span className="text-muted-foreground">intent</span>
            <span className="font-medium">{resolvedStack.intent}</span>
          </div>

          {resolvedStack.frontend && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border transition-all duration-300 animate-in fade-in slide-in-from-right-2">
              <span className="text-muted-foreground">frontend</span>
              <span className="font-medium">{resolvedStack.frontend}</span>
            </div>
          )}

          {resolvedStack.backend && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border transition-all duration-300 animate-in fade-in slide-in-from-right-2">
              <span className="text-muted-foreground">backend</span>
              <span className="font-medium">{resolvedStack.backend}</span>
            </div>
          )}

          {resolvedStack.database && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border transition-all duration-300 animate-in fade-in slide-in-from-right-2">
              <span className="text-muted-foreground">database</span>
              <span className="font-medium">{resolvedStack.database}</span>
            </div>
          )}

          {resolvedStack.auth && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border transition-all duration-300 animate-in fade-in slide-in-from-right-2">
              <span className="text-muted-foreground">auth</span>
              <span className="font-medium">{resolvedStack.auth}</span>
            </div>
          )}
        </div>

        {Object.keys(resolvedStack).length > 1 && (
          <div className="mt-8 pt-8 border-t border-border">
            <Button
              onClick={() => setInput("download my stack")}
              className="w-full"
              size="lg"
            >
              Download Stack
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
