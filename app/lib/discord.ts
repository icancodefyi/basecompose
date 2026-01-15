export async function fetchDiscordPresence(
  serverId: string
): Promise<number> {
  const res = await fetch(
    `https://discord.com/api/guilds/${serverId}/widget.json`
  );

  if (!res.ok) throw new Error("Discord API failed");

  const data = await res.json();
  return data.presence_count;
}
