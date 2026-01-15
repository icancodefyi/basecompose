"use client";

import { useGithubStars } from "@/app/hooks/useGithubStars";
import { useDiscordPresence } from "@/app/hooks/useDiscordPresence";
import { GITHUB_OWNER,GITHUB_REPO,DISCORD_INVITE,DISCORD_SERVER_ID } from "@/app/lib/constants";
import Image from "next/image";
export function NavMetrics() {
  const stars = useGithubStars(GITHUB_OWNER, GITHUB_REPO);
  const online = useDiscordPresence(DISCORD_SERVER_ID);

  return (
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
        <GitHubIcon />
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
        <DiscordIcon />
        <span className="text-sm font-medium text-neutral-200 tabular-nums">
          {online ?? "—"}
        </span>
      </a>
    </div>
  );
}

/* ---------------- Icons ---------------- */

export default function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4 fill-neutral-300"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 008 10.95c.58.1.79-.25.79-.56v-2c-3.26.7-3.95-1.57-3.95-1.57-.53-1.36-1.29-1.72-1.29-1.72-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.41-1.27.74-1.56-2.6-.3-5.34-1.3-5.34-5.8 0-1.28.46-2.33 1.2-3.15-.12-.3-.52-1.52.12-3.16 0 0 .98-.31 3.2 1.2a11.1 11.1 0 015.82 0c2.22-1.51 3.2-1.2 3.2-1.2.64 1.64.24 2.86.12 3.16.75.82 1.2 1.87 1.2 3.15 0 4.51-2.74 5.5-5.35 5.79.42.36.8 1.08.8 2.18v3.23c0 .31.21.66.8.55A11.5 11.5 0 0023.5 12C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <Image src="/icons/socials/discord.svg" alt="Discord" width={16} height={16} />
  );
}
