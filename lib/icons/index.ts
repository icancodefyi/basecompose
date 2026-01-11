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
