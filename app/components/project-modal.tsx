"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectName: string) => void;
  loading?: boolean;
}

export function ProjectModal({ isOpen, onClose, onSubmit, loading = false }: ProjectModalProps) {
  const [projectName, setProjectName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      onSubmit(projectName.trim());
      setProjectName("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white mb-2">Create New Project</h2>
          <p className="text-sm text-[#888888]">Give your project a name to get started</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="projectName" className="block text-sm font-medium text-white mb-2">
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., My Awesome SaaS"
              disabled={loading}
              className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white placeholder:text-[#666666] focus:outline-none focus:ring-2 focus:ring-[#01AE74] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-3 justify-end">
            <Button
              type="button"
              onClick={onClose}
              disabled={loading}
              variant="outline"
              className="bg-transparent border-[#2a2a2a] text-white hover:bg-[#1a1a1a]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!projectName.trim() || loading}
              className="bg-[#01AE74] hover:bg-[#019d67] text-white"
            >
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
