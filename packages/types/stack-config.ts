/**
 * Stack Configuration
 * 
 * Add new technologies here to make them available in the UI and AI.
 * Each category can have multiple options.
 */

export const STACK_CONFIG = {
  intent: {
    label: "Intent",
    description: "What type of application are you building?",
    options: {
      saas: {
        label: "SaaS",
        description: "Full-stack application with frontend and backend",
      },
      api: {
        label: "API",
        description: "Backend-only service",
      },
    },
    required: true,
    default: "saas",
  },
  frontend: {
    label: "Frontend",
    description: "Choose your frontend framework",
    options: {
      nextjs: {
        label: "Next.js",
        description: "React framework with server-side rendering",
        dockerImage: "node:20-alpine",
        port: 3000,
        icon: "nextjs",
      },
      // Add more frontend options here:
      // react: {
      //   label: "React",
      //   description: "React with Vite",
      //   dockerImage: "node:20-alpine",
      //   port: 5173,
      //   icon: "react",
      // },
    },
  },
  backend: {
    label: "Backend",
    description: "Choose your backend runtime",
    options: {
      node: {
        label: "Node.js",
        description: "JavaScript/TypeScript runtime",
        dockerImage: "node:20-alpine",
        port: 3001,
        icon: "nodejs",
      },
      fastapi: {
        label: "FastAPI",
        description: "Python async framework",
        dockerImage: "python:3.11-slim",
        port: 8000,
        icon: "fastapi",
      },
      // Add more backend options here:
      // go: {
      //   label: "Go",
      //   description: "Go HTTP server",
      //   dockerImage: "golang:1.21-alpine",
      //   port: 8080,
      //   icon: "go",
      // },
    },
  },
  database: {
    label: "Database",
    description: "Choose your database",
    options: {
      postgres: {
        label: "PostgreSQL",
        description: "Relational database",
        dockerImage: "postgres:16-alpine",
        port: 5432,
        icon: "postgresql",
        envVars: {
          POSTGRES_USER: "dev",
          POSTGRES_PASSWORD: "dev",
          POSTGRES_DB: "layered_db",
        },
      },
      mongodb: {
        label: "MongoDB",
        description: "NoSQL document database",
        dockerImage: "mongo:7",
        port: 27017,
        icon: "mongodb",
        envVars: {
          MONGODB_URI: "mongodb://root:example@localhost:27017",
          MONGODB_ROOT_USERNAME: "root",
          MONGODB_ROOT_PASSWORD: "example",
        },
      },
      // Add more database options here:
      // mysql: {
      //   label: "MySQL",
      //   description: "Relational database",
      //   dockerImage: "mysql:8.0",
      //   port: 3306,
      //   icon: "mysql",
      //   envVars: {
      //     MYSQL_ROOT_PASSWORD: "dev",
      //     MYSQL_DATABASE: "layered_db",
      //   },
      // },
      // redis: {
      //   label: "Redis",
      //   description: "In-memory cache",
      //   dockerImage: "redis:7-alpine",
      //   port: 6379,
      //   icon: "redis",
      // },
    },
  },
  auth: {
    label: "Authentication",
    description: "Choose your auth solution",
    options: {
      authjs: {
        label: "Auth.js",
        description: "NextAuth.js authentication",
        icon: "nextauth",
        requiresDatabase: true,
      },
      // Add more auth options here:
      // clerk: {
      //   label: "Clerk",
      //   description: "Managed authentication",
      //   requiresDatabase: false,
      // },
    },
  },
} as const;


// Type helpers
export type StackCategory = keyof typeof STACK_CONFIG;
export type StackOption<T extends StackCategory> = keyof typeof STACK_CONFIG[T]["options"];

/**
 * Resolution rules - define how technologies interact
 * Add new rules here when technologies have dependencies
 */
export const RESOLUTION_RULES = [
  {
    name: "Auth requires database",
    condition: (stack: any) => stack.auth && !stack.database,
    apply: (stack: any) => {
      const authOption = STACK_CONFIG.auth.options[stack.auth as keyof typeof STACK_CONFIG.auth.options];
      if (authOption.requiresDatabase) {
        stack.database = "postgres";
      }
    },
  },
  {
    name: "Next.js requires Node backend",
    condition: (stack: any) => stack.frontend === "nextjs" && !stack.backend,
    apply: (stack: any) => {
      stack.backend = "node";
    },
  },
  // Add more resolution rules here:
  // {
  //   name: "FastAPI requires Postgres",
  //   condition: (stack: any) => stack.backend === "fastapi" && !stack.database,
  //   apply: (stack: any) => {
  //     stack.database = "postgres";
  //   },
  // },
];

/**
 * Helper to get all available options for a category
 */
export function getOptions<T extends StackCategory>(category: T) {
  return Object.entries(STACK_CONFIG[category].options).map(([key, value]) => ({
    key,
    ...value,
  }));
}

/**
 * Helper to get option config
 */
export function getOptionConfig(
  category: StackCategory,
  option: string
): any {
  const categoryConfig = STACK_CONFIG[category];
  if (!categoryConfig) return null;
  return (categoryConfig.options as Record<string, any>)[option];
}
