"use client";

import { useState, useEffect, useRef } from "react";
import type { StackBlueprint, Project, ChatMessage } from "@/packages/types";
import { STACK_CONFIG } from "@/packages/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
import { StackArtifact } from "../components/stack-artifact";
import { StackItem } from "../components/stack-item";
import { ProjectModal } from "../components/project-modal";
import { ProjectsSidebar } from "../components/projects-sidebar";
import { GitHubPushModal } from "../components/github-push-modal";
import { useAuth } from "@/app/hooks/useAuth";
import { getUserIdFromSession } from "@/lib/auth-utils";

function resolveStack(input: StackBlueprint): StackBlueprint {
  return input;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const router = useRouter();
  const { session, isAuthenticated, loading: authLoading, signIn, signOut } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stack, setStack] = useState<StackBlueprint>({ intent: "saas" });
  const [messageCount, setMessageCount] = useState(0);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resolvedStack = resolveStack(stack);
  const canSendMessage = isAuthenticated ? true : messageCount < 5;
  const isAtLimit = !isAuthenticated && messageCount >= 5;

  // Load projects for authenticated users
  useEffect(() => {
    if (isAuthenticated && session?.user) {
      loadProjects();
    }
  }, [isAuthenticated, session]);

  // Load chat history when project changes
  useEffect(() => {
    if (currentProjectId) {
      loadChatHistory(currentProjectId);
    }
  }, [currentProjectId]);

  const loadProjects = async () => {
    try {
      const userId = await getUserIdFromSession(session);
      if (!userId) return;

      const response = await fetch(`/api/projects?userId=${userId}`);
      const data = await response.json();
      
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  };

  const loadChatHistory = async (projectId: string) => {
    try {
      const response = await fetch(`/api/chat/history?projectId=${projectId}`);
      const data = await response.json();
      
      if (data.messages) {
        const formattedMessages: Message[] = data.messages.map((msg: ChatMessage) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content
        }));
        setMessages(formattedMessages);

        // Load the last blueprint from messages if available
        const lastBlueprint = data.messages
          .slice()
          .reverse()
          .find((msg: ChatMessage) => msg.blueprint)?.blueprint;
        
        if (lastBlueprint) {
          setStack(lastBlueprint);
        }
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  const saveMessage = async (role: "user" | "assistant", content: string, blueprint?: StackBlueprint) => {
    if (!currentProjectId) return;

    try {
      await fetch("/api/chat/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: currentProjectId,
          role,
          content,
          blueprint
        })
      });
    } catch (error) {
      console.error("Failed to save message:", error);
    }
  };

  const handleCreateProject = async (projectName: string) => {
    if (!isAuthenticated) {
      setShowProjectModal(false);
      await signIn("google", { callbackUrl: "/chat" });
      return;
    }

    setProjectLoading(true);
    try {
      const userId = await getUserIdFromSession(session);
      if (!userId) return;

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName, userId })
      });

      const data = await response.json();
      
      if (data.project) {
        setProjects([data.project, ...projects]);
        setCurrentProjectId(data.project._id);
        setMessages([]);
        setStack({ intent: "saas" });
        setShowProjectModal(false);
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setProjectLoading(false);
    }
  };

  const handleNewProject = () => {
    setShowProjectModal(true);
  };

  // Redirect to signin if not authenticated (after checking initial load)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // Allow 5 messages before redirecting
      if (messageCount >= 5) {
        router.push("/auth/signin?callbackUrl=/chat");
      }
    }
  }, [authLoading, isAuthenticated, messageCount, router]);

  const getIconKey = (category: keyof typeof STACK_CONFIG, value?: string) => {
    if (!value) return undefined;
    const options = STACK_CONFIG[category]?.options as Record<string, any> | undefined;
    return options?.[value]?.icon as string | undefined;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load message count from localStorage or API
    const saved = localStorage.getItem("BaseCompose_message_count");
    if (saved) setMessageCount(parseInt(saved));
  }, []);

  useEffect(() => {
    // Auto-open modal when free tier is exhausted
    if (!isAuthenticated && messageCount >= 5 && messages.length > 0) {
      setShowSignupModal(true);
    }
  }, [messageCount, isAuthenticated, messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Check limits
    if (!canSendMessage) {
      setShowSignupModal(true);
      return;
    }

    // If authenticated but no project, prompt for project creation
    if (isAuthenticated && !currentProjectId) {
      setShowProjectModal(true);
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    // Save user message
    if (currentProjectId) {
      await saveMessage("user", userMessage);
    }

    // Increment message count immediately when user sends message (for non-authenticated users)
    if (!isAuthenticated) {
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      localStorage.setItem("BaseCompose_message_count", newCount.toString());
    }

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

      // Save assistant message
      if (currentProjectId) {
        await saveMessage("assistant", data.message);
      }

      if (data.action === "modify" && data.changes) {
        const updatedStack = { ...stack };
        Object.entries(data.changes).forEach(([key, value]) => {
          if (value === null) {
            delete updatedStack[key as keyof StackBlueprint];
          } else if (value !== undefined) {
            (updatedStack as any)[key] = value;
          }
        });
        setStack(updatedStack);

        // Save updated stack to project
        if (currentProjectId) {
          await saveMessage("assistant", data.message, updatedStack);
        }
      } else if (data.action === "download") {
        // Check if user needs to sign up
        if (!isAuthenticated && messageCount >= 5) {
          setShowSignupModal(true);
          return;
        }

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
          a.download = "BaseCompose-stack.tar.gz";
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          const successMsg = "✓ Stack downloaded as BaseCompose-stack.tar.gz";
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: successMsg,
            },
          ]);

          // Save download confirmation and update project status
          if (currentProjectId) {
            await saveMessage("assistant", successMsg, resolvedStack);
            await fetch("/api/projects", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                projectId: currentProjectId,
                status: "generated",
                blueprint: resolvedStack
              })
            });
          }
        }
      } else if (data.action === "push-github") {
        // Check if user is authenticated
        if (!isAuthenticated) {
          setShowSignupModal(true);
          return;
        }

        // Open GitHub push modal
        setShowGitHubModal(true);
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
      // Restore focus to input after message is sent
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleNewChat = () => {
    if (isAuthenticated) {
      setShowProjectModal(true);
    } else {
      setMessages([]);
      setStack({ intent: "saas" });
      setCurrentProjectId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01AE74]"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Projects Sidebar */}
      <ProjectsSidebar
        projects={projects}
        currentProjectId={currentProjectId || undefined}
        onNewProject={handleNewProject}
        isAuthenticated={isAuthenticated}
        session={session}
        signIn={async () => {
          await signIn("google", { callbackUrl: "/chat" });
        }}
        signOut={signOut}
        messageCount={messageCount}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full md:w-auto pt-14 md:pt-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center space-y-6 md:space-y-8 w-full max-w-2xl">
                <div className="space-y-2 md:space-y-4">
                  <h1 className="text-3xl md:text-5xl font-normal leading-[1.3]">How can I help you?</h1>
                  <p className="text-sm md:text-base text-[#999999] font-light">Tell me what stack you want to build</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {[
                    { title: "SaaS App", subtitle: "with authentication" },
                    { title: "Full-Stack", subtitle: "Next.js + MongoDB" },
                    { title: "Authentication Setup", subtitle: "NextAuth.js" },
                    { title: "Database Setup", subtitle: "MongoDB" },
                  ].map((item) => (
                    <button
                      key={item.title}
                      onClick={() => setInput(item.title)}
                      className="p-3 md:p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] text-left transition-colors"
                    >
                      <div className="text-xs md:text-sm font-medium text-foreground">{item.title}</div>
                      <div className="text-xs text-[#666666] mt-1">{item.subtitle}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-full md:max-w-3xl mx-auto px-3 md:px-4 py-4 md:py-8 space-y-4 md:space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx}>
                  <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`rounded-xl px-3 md:px-4 py-2 md:py-3 max-w-xs md:max-w-[70%] text-sm md:text-base ${
                        msg.role === "user"
                          ? "bg-[#01AE74] text-white"
                          : "bg-[#1a1a1a] text-[#d0d0d0] border border-[#2a2a2a]"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                      ) : (
                        <div className="text-sm leading-relaxed space-y-1">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="text-[#d0d0d0] text-sm">{children}</p>,
                              h1: ({ children }) => <h1 className="text-base font-bold text-emerald-300 pt-1">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-sm font-bold text-emerald-300 pt-0.5">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-xs font-bold text-emerald-300">{children}</h3>,
                              ul: ({ children }) => <ul className="list-disc list-inside text-[#d0d0d0] space-y-0.5">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside text-[#d0d0d0] space-y-0.5">{children}</ol>,
                              li: ({ children }) => <li className="text-sm text-[#d0d0d0]">{children}</li>,
                              strong: ({ children }) => <strong className="text-emerald-300 font-semibold">{children}</strong>,
                              em: ({ children }) => <em className="text-gray-400 italic">{children}</em>,
                              a: ({ href, children }) => (
                                <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline">
                                  {children}
                                </a>
                              ),
                              code: ({ children }) => <code className="bg-black/50 px-1.5 py-0.5 rounded text-emerald-300 text-xs font-mono">{children}</code>,
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-emerald-500/40 pl-2.5 italic text-gray-400 text-sm py-0.5">
                                  {children}
                                </blockquote>
                              ),
                              pre: ({ children }) => (
                                <pre className="bg-black/50 p-2 rounded overflow-x-auto text-xs my-0.5">
                                  {children}
                                </pre>
                              ),
                              hr: () => <hr className="my-1 border-t border-[#2a2a2a]" />,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Artifact Card */}
                  {msg.role === "assistant" && Object.keys(resolvedStack).length > 1 && idx === messages.length - 1 && (
                    <div className="mt-3 md:mt-4">
                      <div className="border border-[#3a3a3a] rounded-xl bg-[#1a1a1a] overflow-hidden">
                        <div className="bg-[#252525] border-b border-[#3a3a3a] px-3 md:px-4 py-2 md:py-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#01AE74]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                          <span className="text-xs md:text-sm font-medium text-foreground">Stack Configuration</span>
                        </div>
                        <div className="p-3 md:p-4 space-y-2 md:space-y-3 overflow-x-auto">
                          <StackArtifact stack={resolvedStack} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 md:px-4 py-2 md:py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-[#666666] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#666666] rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-[#666666] rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}

              {isAtLimit && (
                <div className="flex justify-center">
                  <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg px-4 py-3 max-w-md">
                    <p className="text-xs md:text-sm text-amber-300">
                      You've used all 5 free messages. Sign in to continue building!
                    </p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-[#2a2a2a] bg-background px-3 md:px-4 py-4 md:py-6">
          <div className="max-w-full md:max-w-3xl mx-auto">
            {!canSendMessage && (
              <div className="mb-3 p-2 md:p-3 bg-amber-900/20 border border-amber-700/50 rounded-lg text-xs md:text-sm text-amber-300">
                Free message limit reached. Sign in to continue! →
              </div>
            )}
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center gap-2 md:gap-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-3 md:px-4 py-3 md:py-4 hover:border-[#3a3a3a] focus-within:border-[#3a3a3a] focus-within:ring-1 focus-within:ring-[#3a3a3a] transition-all">
                {/* Plus Button */}
                <button
                  type="button"
                  className="shrink-0 p-2 rounded-lg hover:bg-[#2a2a2a] text-[#666666] hover:text-[#d0d0d0] transition-colors"
                  title="Add attachment"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>

                {/* Input Field */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={canSendMessage ? "Ask BaseCompose to build..." : "Sign in to continue..."}
                  className="flex-1 bg-transparent text-sm md:text-base text-[#d0d0d0] placeholder:text-[#666666] focus:outline-none"
                  disabled={loading || !canSendMessage}
                  autoFocus
                />

                {/* Model Selector */}
                <div className="shrink-0 flex items-center gap-1 px-2 md:px-3 py-1 rounded-lg bg-[#0a0a0a] border border-[#3a3a3a] text-xs md:text-sm text-[#d0d0d0]">
                  <span>⚡</span>
                  <span>BaseCompose</span>
                  <svg className="w-3 h-3 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {/* Send Button */}
                <Button
                  type="submit"
                  disabled={loading || !input.trim() || !canSendMessage}
                  size="icon"
                  className="shrink-0 bg-[#01AE74] hover:bg-[#018e58] text-white rounded-lg h-8 md:h-9 w-8 md:w-9"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Stack Info - Hidden on mobile */}
      <div className="hidden lg:flex w-80 bg-[#111111] border-l border-[#2a2a2a] flex-col">
        <div className="p-4 border-b border-[#2a2a2a]">
          <h2 className="text-sm font-semibold text-foreground">Current Stack</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#666666]">intent</span>
              <span className="text-xs font-mono font-medium text-[#01AE74]">{resolvedStack.intent}</span>
            </div>
          </div>

          {resolvedStack.frontend && (
            <StackItem
              label="frontend"
              value={resolvedStack.frontend}
              iconKey={getIconKey("frontend", resolvedStack.frontend)}
              onRemove={() => setStack((prev) => ({ ...prev, frontend: undefined }))}
            />
          )}

          {resolvedStack.database && (
            <StackItem
              label="database"
              value={resolvedStack.database}
              iconKey={getIconKey("database", resolvedStack.database)}
              onRemove={() => setStack((prev) => ({ ...prev, database: undefined }))}
            />
          )}

          {resolvedStack.auth && (
            <StackItem
              label="auth"
              value={resolvedStack.auth}
              iconKey={getIconKey("auth", resolvedStack.auth)}
              onRemove={() => setStack((prev) => ({ ...prev, auth: undefined }))}
            />
          )}
        </div>

        {Object.keys(resolvedStack).length > 1 && (
          <div className="p-3 border-t border-[#2a2a2a] space-y-2">
            <Button
              onClick={() => setInput("download my stack")}
              className="w-full bg-[#01AE74] hover:bg-[#018e58] text-white text-sm"
              disabled={!isAuthenticated && isAtLimit}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Stack
            </Button>

            {isAuthenticated && (
              <Button
                onClick={() => setShowGitHubModal(true)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Push to GitHub
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-semibold">Unlock More Features</h2>
              <p className="text-sm text-[#999999]">
                You've used your 5 free messages. Sign in to get unlimited messages and downloads.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={async () => {
                  await signIn("google", { callbackUrl: "/chat" });
                }}
                className="w-full bg-white text-black hover:bg-gray-100 justify-center"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </Button>

              <Button
                onClick={async () => {
                  await signIn("github", { callbackUrl: "/chat" });
                }}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white justify-center border border-gray-700"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Sign in with GitHub
              </Button>

              <Button
                onClick={() => setShowSignupModal(false)}
                variant="outline"
                className="w-full"
              >
                Maybe Later
              </Button>
            </div>

            <div className="text-xs text-[#666666] text-center">
              You'll get unlimited messages, downloads, and project history.
            </div>
          </div>
        </div>
      )}

      {/* GitHub Push Modal */}
      <GitHubPushModal
        isOpen={showGitHubModal}
        stack={resolvedStack}
        onClose={() => setShowGitHubModal(false)}
        onSuccess={(repoUrl) => {
          const successMsg = `✨ Repository created and pushed! [View on GitHub](${repoUrl})`;
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: successMsg,
            },
          ]);
        }}
      />

      {/* Project Creation Modal */}
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSubmit={handleCreateProject}
        loading={projectLoading}
      />
    </div>
  );
}
