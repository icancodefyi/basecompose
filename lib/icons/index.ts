// Direct icon map for use with plain <img> tags (devicons CDN URLs)
export const iconMap: Record<string, string> = {
  nextjs: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  react: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  nodejs: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  fastapi: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg",
  go: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg",
  postgresql: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  mysql: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  redis: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg",
  nextauth: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextauth/nextauth-original.svg",
};
import { frontendIcons } from "./frontend-icons";
import { backendIcons } from "./backend-icons";
import { databaseIcons } from "./database-icons";
import { authIcons } from "./auth-icons";

export { frontendIcons, backendIcons, databaseIcons, authIcons };

// Combined icon registry for easy lookup
export const techIcons: Record<string, string> = {
  ...frontendIcons,
  ...backendIcons,
  ...databaseIcons,
  ...authIcons,
};

/**
 * Get tech icon URL by key
 * @param iconKey - The icon identifier (e.g., 'nextjs', 'nodejs', 'postgresql')
 * @returns Icon URL or null if not found
 */
export function getTechIcon(iconKey: string): string | null {
  return techIcons[iconKey] || null;
}
