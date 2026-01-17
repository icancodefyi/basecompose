# Contributing to BaseCompose

Thanks for your interest in contributing! This guide will help you add new stack options.


## Adding New Stack Options

All stack configurations are centralized in [`packages/types/stack-config.ts`](packages/types/stack-config.ts).

### 1. Add a New Technology Option

Find the appropriate category (frontend, backend, database, auth) and add your option:

```typescript
backend: {
  label: "Backend",
  description: "Choose your backend runtime",
  options: {
    // Existing options...
    go: {
      label: "Go",
      description: "Go HTTP server",
      dockerImage: "golang:1.21-alpine",
      port: 8080,
    },
  },
}
```

### 2. Add Resolution Rules (Optional)

If your technology has dependencies, add a resolution rule:

```typescript
export const RESOLUTION_RULES = [
  // Existing rules...
  {
    name: "Go requires PostgreSQL",
    condition: (stack: any) => stack.backend === "go" && !stack.database,
    apply: (stack: any) => {
      stack.database = "postgres";
    },
  },
];
```

### 3. Update TypeScript Types

Update [`packages/types/blueprint.ts`](packages/types/blueprint.ts) to include your new option:

```typescript
export type StackBlueprint = {
  intent: "saas" | "api";
  frontend?: "nextjs";
  backend?: "node" | "fastapi" | "go"; // Add "go" here
  database?: "postgres";
  auth?: "authjs";
};
```

### 4. Test Your Changes

1. **Type check:**
   ```bash
   pnpm exec tsc --noEmit
   ```

2. **Test in UI:**
   - Start dev server: `pnpm dev`
   - Chat with AI: "I need a Go backend"
   - Verify stack updates in sidebar
   - Click "Download Stack" and check generated files

3. **Verify generated files:**
   - Open the downloaded zip
   - Check `docker-compose.yml` has your service
   - Verify ports and environment variables

## Adding New Categories

To add a completely new category (e.g., "monitoring"):

### 1. Add to Stack Config

```typescript
export const STACK_CONFIG = {
  // Existing categories...
  monitoring: {
    label: "Monitoring",
    description: "Choose your monitoring solution",
    options: {
      prometheus: {
        label: "Prometheus",
        description: "Metrics and alerting",
        dockerImage: "prom/prometheus:latest",
        port: 9090,
      },
    },
  },
} as const;
```

### 2. Update Blueprint Type

```typescript
export type StackBlueprint = {
  intent: "saas" | "api";
  frontend?: "nextjs";
  backend?: "node" | "fastapi";
  database?: "postgres";
  auth?: "authjs";
  monitoring?: "prometheus"; // Add new category
};
```

### 3. Update Docker Generator

Edit [`packages/engine/emit/docker.ts`](packages/engine/emit/docker.ts):

```typescript
// Add after other services
if (stack.monitoring) {
  const monitoringConfig = getOptionConfig("monitoring", stack.monitoring);
  services[stack.monitoring] = {
    image: monitoringConfig.dockerImage,
    ports: [`${monitoringConfig.port}:${monitoringConfig.port}`],
    // ... add volumes, configs, etc.
  };
}
```

### 4. Update ENV Generator

Edit [`packages/engine/emit/env.ts`](packages/engine/emit/env.ts):

```typescript
if (stack.monitoring === "prometheus") {
  lines.push("\n# Monitoring (Prometheus)");
  lines.push("PROMETHEUS_RETENTION=15d");
}
```

### 5. Update README Generator

Edit [`packages/engine/emit/readme.ts`](packages/engine/emit/readme.ts):

```typescript
if (stack.monitoring) lines.push(`- Monitoring: ${stack.monitoring}`);
```

## Best Practices

### Config Structure

Each option should have:
- `label`: User-facing name
- `description`: Short explanation
- `dockerImage`: Docker image to use
- `port`: Default port number
- `envVars`: (Optional) Environment variables object
- `requiresDatabase`: (Optional) Boolean flag

### Resolution Rules

- Keep rules simple and focused
- Use descriptive names
- Test interactions between rules
- Document why the rule exists

### Testing

Before submitting a PR:
1. ✅ Type checking passes
2. ✅ AI can understand your new option
3. ✅ Generated docker-compose.yml is valid
4. ✅ All existing tests pass
5. ✅ New option appears in UI

## Example: Adding Redis

Here's a complete example of adding Redis support:

### 1. Add to config

```typescript
database: {
  options: {
    postgres: { /* existing */ },
    redis: {
      label: "Redis",
      description: "In-memory cache",
      dockerImage: "redis:7-alpine",
      port: 6379,
    },
  },
}
```

### 2. Update blueprint type

```typescript
database?: "postgres" | "redis";
```

### 3. Update docker generator

The existing code already handles this dynamically! No changes needed.

### 4. Update env generator

```typescript
if (stack.database === "redis") {
  lines.push("\n# Database (Redis)");
  lines.push("REDIS_URL=redis://localhost:6379");
}
```

### 5. Test

```bash
pnpm dev
# Chat: "add redis cache"
# Verify in sidebar
# Download and check files
```

## Questions?

- Check existing code in `packages/types/stack-config.ts`
- Look at how existing options are implemented
- Open an issue for discussion

## Code Style

- Use TypeScript strict mode
- Follow existing naming conventions
- Add JSDoc comments for new functions
- Keep configuration declarative
