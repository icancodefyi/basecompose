"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StackBlueprint } from "@BaseCompose/types";

interface GitHubPushModalProps {
  isOpen: boolean;
  stack: StackBlueprint;
  onClose: () => void;
  onSuccess?: (repoUrl: string) => void;
}

export function GitHubPushModal({
  isOpen,
  stack,
  onClose,
  onSuccess,
}: GitHubPushModalProps) {
  const [repoName, setRepoName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/github/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stack, repoName, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to push to GitHub");
      }

      setRepoName("");
      setDescription("");

      if (onSuccess) {
        onSuccess(data.repository.url);
      }

      // Show success message
      alert(`✨ Repository created!\n\n${data.repository.url}`);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-white mb-4">Push to GitHub</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="repoName" className="text-zinc-300">
              Repository Name
            </Label>
            <Input
              id="repoName"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="my-awesome-project"
              required
              className="mt-2 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-zinc-300">
              Repository Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A cool project built with BaseCompose"
              required
              className="mt-2 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-800 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !repoName || !description}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? "Pushing..." : "Push to GitHub"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
