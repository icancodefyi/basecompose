"use client";

import { useState, useEffect, useRef } from "react";
import type { StackBlueprint, Project, ChatMessage } from "@/packages/types";
import { STACK_CONFIG } from "@/packages/types";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StackArtifact } from "../../components/stack-artifact";
import { StackItem } from "../../components/stack-item";
import { ProjectModal } from "../../components/project-modal";
import { ProjectsSidebar } from "../../components/projects-sidebar";
import { useAuth } from "@/app/hooks/useAuth";
import { getUserIdFromSession } from "@/lib/auth-utils";

function resolveStack(input: StackBlueprint): StackBlueprint {
  return input;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ProjectChatPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  
  const { session, isAuthenticated, loading: authLoading, signIn, signOut } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stack, setStack] = useState<StackBlueprint>({ intent: "saas" });
  const [messageCount, setMessageCount] = useState(0);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectLoading, setProjectLoading] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
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

  // Load chat history when component mounts or projectId changes
  useEffect(() => {
    if (projectId && isAuthenticated) {
      loadChatHistory(projectId);
      loadProjectDetails(projectId);
    }
  }, [projectId, isAuthenticated]);

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

  const loadProjectDetails = async (projectId: string) => {
    try {
      const userId = await getUserIdFromSession(session);
      if (!userId) return;

      const response = await fetch(`/api/projects?userId=${userId}&projectId=${projectId}`);
      const data = await response.json();
      
      if (data.project) {
        setCurrentProject(data.project);
        if (data.project.blueprint) {
          setStack(data.project.blueprint);
        }
      }
    } catch (error) {
      console.error("Failed to load project details:", error);
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
    if (!projectId) return;

    try {
      await fetch("/api/chat/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
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
        setShowProjectModal(false);
        router.push(`/chat/${data.project._id}`);
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

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/signin?callbackUrl=/chat");
    }
  }, [authLoading, isAuthenticated, router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    // Save user message
    await saveMessage("user", userMessage);

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
      await saveMessage("assistant", data.message);

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
        await saveMessage("assistant", data.message, updatedStack);
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
          await saveMessage("assistant", successMsg, resolvedStack);
          await fetch("/api/projects", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              projectId,
              status: "generated",
              blueprint: resolvedStack
            })
          });
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
      // Restore focus to input after message is sent
      setTimeout(() => inputRef.current?.focus(), 100);
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
        currentProjectId={projectId}
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
        {/* Project Header */}
        {currentProject && (
          <div className="border-b border-[#2a2a2a] px-4 py-3 bg-[#0a0a0a]">
            <div className="max-w-3xl mx-auto flex items-center gap-2">
              <span className="text-lg">📁</span>
              <h2 className="text-sm font-medium text-white">{currentProject.name}</h2>
              {currentProject.status === "generated" && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Generated
                </span>
              )}
            </div>
          </div>
        )}

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
                    { title: "Full-Stack", subtitle: "Next.js + Node.js" },
                    { title: "API Service", subtitle: "Backend only" },
                    { title: "Add Database", subtitle: "MongoDB/PostgreSQL" },
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
                      <p className="leading-relaxed">{msg.content}</p>
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

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-[#2a2a2a] bg-background px-3 md:px-4 py-4 md:py-6">
          <div className="max-w-full md:max-w-3xl mx-auto">
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
                  placeholder="Ask BaseCompose to build..."
                  className="flex-1 bg-transparent text-sm md:text-base text-[#d0d0d0] placeholder:text-[#666666] focus:outline-none"
                  disabled={loading}
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
                  disabled={loading || !input.trim()}
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
          <div className="p-3 border-t border-[#2a2a2a]">
            <Button
              onClick={() => setInput("download my stack")}
              className="w-full bg-[#01AE74] hover:bg-[#018e58] text-white text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Stack
            </Button>
          </div>
        )}
      </div>

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
