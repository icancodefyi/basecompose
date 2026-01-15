"use client";

import { useGithubStars } from "@/app/hooks/useGithubStars";
import { useDiscordPresence } from "@/app/hooks/useDiscordPresence";
import { GITHUB_OWNER,GITHUB_REPO,DISCORD_INVITE,DISCORD_SERVER_ID } from "@/app/lib/constants";
import Image from "next/image";

// Add pulse animation keyframes
const pulseStyle = `
  @keyframes pulse-dot {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  .pulse-dot {
    animation: pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;

export function NavMetrics() {
  const stars = useGithubStars(GITHUB_OWNER, GITHUB_REPO);
  const online = useDiscordPresence(DISCORD_SERVER_ID);

  return (
    <>
      <style>{pulseStyle}</style>
      <div className="flex items-center gap-2">
        {/* GitHub */}
        <a
          href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`}
          target="_blank"
          aria-label="GitHub stars"
          className="
            flex items-center gap-2
            px-3 py-1.5
            rounded-lg
            border border-neutral-800
            bg-neutral-900/40
            hover:bg-neutral-800/60
            transition
          "
        >
          <StarIcon />
          <span className="text-sm font-medium text-neutral-200 tabular-nums">
            {stars ?? "—"}
          </span>
        </a>

        {/* Discord */}
        <a
          href={`https://discord.com/invite/${DISCORD_INVITE}`}
          target="_blank"
          aria-label="Discord online members"
          className="
            flex items-center gap-2
            px-3 py-1.5
            rounded-lg
            border border-neutral-800
            bg-neutral-900/40
            hover:bg-neutral-800/60
            transition
          "
        >
          <div className="relative flex items-center gap-2">
            <div className="pulse-dot w-2 h-2 bg-emerald-400 rounded-full"></div>
            <DiscordIcon />
          </div>
          <span className="text-sm font-medium text-neutral-200 tabular-nums">
            {online ?? "—"}
          </span>
        </a>
      </div>
    </>
  );
}

/* ---------------- Icons ---------------- */

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4 fill-yellow-400"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <Image src="/icons/socials/discord.svg" alt="Discord" width={16} height={16} />
  );
}
