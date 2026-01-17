"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project } from "@/packages/types";
import { Button } from "@/components/ui/button";

interface ProjectsSidebarProps {
  projects: Project[];
  currentProjectId?: string;
  onNewProject: () => void;
  isAuthenticated: boolean;
  session: any;
  signIn: () => void;
  signOut: () => void;
  messageCount: number;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function ProjectsSidebar({
  projects,
  currentProjectId,
  onNewProject,
  isAuthenticated,
  session,
  signIn,
  signOut,
  messageCount,
  sidebarOpen,
  setSidebarOpen
}: ProjectsSidebarProps) {
  const router = useRouter();

  return (
    <div
      className={`fixed md:relative w-64 h-full bg-[#111111] border-r border-[#2a2a2a] flex flex-col z-30 transform transition-transform md:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header with Auth */}
      <div className="p-4 border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between gap-2">
          <Link href="/">
            <h1 className="text-lg font-normal text-[#01AE74] leading-[1.3]">BaseCompose</h1>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 hover:bg-[#1a1a1a] rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Auth Section */}
        <div className="mt-3 pt-3 border-t border-[#2a2a2a]">
          {isAuthenticated && session?.user ? (
            <div className="space-y-3">
              <div className="bg-[#1a1a1a] rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{session.user.name}</p>
                    <p className="text-xs text-[#666666] truncate">{session.user.email}</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={async () => {
                  await signOut();
                  router.push("/");
                }}
                variant="outline"
                size="sm"
                className="w-full justify-center text-xs bg-white text-black cursor-pointer"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-[#666666]">{messageCount}/5 messages used</div>
              <Button
                onClick={signIn}
                size="sm"
                className="w-full justify-center text-xs bg-white text-black hover:bg-gray-100"
              >
                Sign in with Google
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3 border-b border-[#2a2a2a]">
        <Button
          onClick={onNewProject}
          className="w-full justify-start bg-[#1a1a1a] hover:bg-[#222222] text-foreground border border-[#2a2a2a] hover:text-gray-300"
          variant="outline"
          size="sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
          </svg>
          New Project
        </Button>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {projects.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-[#666666]">
            No projects yet.<br />Create one to get started!
          </div>
        ) : (
          projects.map((project) => (
            <button
              key={project._id}
              onClick={() => {
                router.push(`/chat/${project._id}`);
                setSidebarOpen(false);
              }}
              className={`w-full px-3 py-2.5 rounded-lg text-left text-sm flex items-start gap-2 transition-colors ${
                currentProjectId === project._id
                  ? "bg-[#1a1a1a] text-white border border-[#2a2a2a]"
                  : "text-[#d0d0d0] hover:bg-[#1a1a1a]"
              }`}
            >
              <span className="text-base mt-0.5">📁</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{project.name}</div>
                <div className="text-xs text-[#666666] mt-0.5">
                  {new Date(project.lastMessageAt).toLocaleDateString()}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
