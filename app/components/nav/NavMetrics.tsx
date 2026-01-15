"use client";
import { useGithubStars } from "@/app/hooks/useGithubStars";
import { useDiscordPresence } from "@/app/hooks/useDiscordPresence";
import {
  GITHUB_OWNER,
  GITHUB_REPO,
  DISCORD_SERVER_ID,
  DISCORD_INVITE,
} from "@/app/lib/constants";

export function NavMetrics() {
  const stars = useGithubStars(GITHUB_OWNER, GITHUB_REPO);
  const online = useDiscordPresence(DISCORD_SERVER_ID);

  return (
    <div className="flex items-center gap-3">
      <a
        href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`}
        target="_blank"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-neutral-700 hover:bg-neutral-900"
      >
        <GitHubIcon />
        <span className="text-xs text-neutral-300">
          {stars ?? "—"}
        </span>
      </a>

      <a
        href={`https://discord.com/invite/${DISCORD_INVITE}`}
        target="_blank"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-neutral-700 hover:bg-neutral-900"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-xs text-neutral-300">
          {online ?? "—"}
        </span>
      </a>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
      <path d="M12 .5C5.73.5.5 5.73.5 12..." />
    </svg>
  );
}
