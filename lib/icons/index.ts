// Import icons by category
import { NextjsIcon } from "./frontend";
import { NodejsIcon, FastapiIcon } from "./backend";
import { PostgresqlIcon, MongodbIcon } from "./database";
import { NextAuthIcon } from "./auth";

// Re-export icon metadata utilities for AI discovery
export {
  getAllIconKeys,
  getIconsByCategory,
  getIconMetadata,
  getAllIconMetadata,
  iconMetadataRegistry,
  type IconKey,
  type IconMetadata,
} from "./icon-metadata";

// Re-export category indexes
export * from "./frontend";
export * from "./backend";
export * from "./database";
export * from "./auth";

/**
 * Icon component registry
 * Maps icon keys to their React components
 * 
 * Available icons organized by category:
 * - Frontend: nextjs
 * - Backend: nodejs, fastapi
 * - Database: postgresql, mongodb
 * - Auth: nextauth
 */
export const iconRegistry: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  // Frontend
  nextjs: NextjsIcon,
  // Backend
  nodejs: NodejsIcon,
  fastapi: FastapiIcon,
  // Database
  postgresql: PostgresqlIcon,
  mongodb: MongodbIcon,
  // Auth
  nextauth: NextAuthIcon,
};

/**
 * Get icon component by key
 * 
 * @example
 * ```tsx
 * const IconComponent = getIconComponent('nextjs');
 * if (IconComponent) {
 *   return <IconComponent className="w-6 h-6" />;
 * }
 * ```
 * 
 * @param iconKey - The icon identifier (e.g., 'nextjs', 'nodejs', 'postgresql')
 * @returns Icon component or null if not found
 */
export function getIconComponent(
  iconKey: string
): React.ComponentType<{ className?: string }> | null {
  return iconRegistry[iconKey] || null;
}
