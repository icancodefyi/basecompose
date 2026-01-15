/**
 * Icon metadata for AI-friendly discovery and rendering
 * Use this to easily discover available icons and their properties
 */

export type IconKey = 
  | "nextjs"
  | "nodejs"
  | "fastapi"
  | "postgresql"
  | "mongodb"
  | "nextauth";

export interface IconMetadata {
  /** The unique identifier for the icon */
  key: IconKey;
  /** Human-readable name */
  name: string;
  /** Description of what this icon represents */
  description: string;
  /** Category: 'frontend', 'backend', 'database', 'auth' */
  category: "frontend" | "backend" | "database" | "auth";
}

/**
 * Comprehensive icon catalog with metadata
 * Perfect for AI systems to discover and reference icons
 */
export const iconMetadataRegistry: Record<IconKey, IconMetadata> = {
  nextjs: {
    key: "nextjs",
    name: "Next.js",
    description: "Next.js - React framework for production",
    category: "frontend",
  },
  nodejs: {
    key: "nodejs",
    name: "Node.js",
    description: "Node.js - JavaScript runtime for server-side development",
    category: "backend",
  },
  fastapi: {
    key: "fastapi",
    name: "FastAPI",
    description: "FastAPI - Modern Python web framework for building APIs",
    category: "backend",
  },
  postgresql: {
    key: "postgresql",
    name: "PostgreSQL",
    description: "PostgreSQL - Advanced open-source relational database",
    category: "database",
  },
  mongodb: {
    key: "mongodb",
    name: "MongoDB",
    description: "MongoDB - NoSQL document database",
    category: "database",
  },
  nextauth: {
    key: "nextauth",
    name: "NextAuth.js",
    description: "NextAuth.js - Authentication library for Next.js applications",
    category: "auth",
  },
};

/**
 * Get all available icon keys
 * @returns Array of all icon identifiers
 */
export function getAllIconKeys(): IconKey[] {
  return Object.keys(iconMetadataRegistry) as IconKey[];
}

/**
 * Get all icons in a specific category
 * @param category - The category to filter by
 * @returns Array of icon keys in that category
 */
export function getIconsByCategory(
  category: "frontend" | "backend" | "database" | "auth"
): IconKey[] {
  return getAllIconKeys().filter(
    (key) => iconMetadataRegistry[key].category === category
  );
}

/**
 * Get metadata for a specific icon
 * @param iconKey - The icon identifier
 * @returns Icon metadata or undefined if not found
 */
export function getIconMetadata(iconKey: string): IconMetadata | undefined {
  return iconMetadataRegistry[iconKey as IconKey];
}

/**
 * Get all icons with their metadata
 * @returns Array of all icon metadata objects
 */
export function getAllIconMetadata(): IconMetadata[] {
  return getAllIconKeys().map((key) => iconMetadataRegistry[key]);
}
