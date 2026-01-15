"use client";
import { useEffect, useState } from "react";
import { fetchDiscordPresence } from "../lib/discord";

export function useDiscordPresence(serverId: string) {
  const [online, setOnline] = useState<number | null>(null);

  useEffect(() => {
    fetchDiscordPresence(serverId)
      .then(setOnline)
      .catch(() => setOnline(null));
  }, [serverId]);

  return online;
}
