import type { StackBlueprint } from "@layered/types";

export function generateDockerCompose(stack: StackBlueprint): string {
  const services: Record<string, unknown> = {};
  const volumes: Record<string, unknown> = {};

  // Database service
  if (stack.database === "postgres") {
    services.postgres = {
      image: "postgres:16-alpine",
      environment: {
        POSTGRES_USER: "dev",
        POSTGRES_PASSWORD: "dev",
        POSTGRES_DB: "layered_db",
      },
      ports: ["5432:5432"],
      volumes: ["postgres_data:/var/lib/postgresql/data"],
      healthcheck: {
        test: ["CMD-SHELL", "pg_isready -U dev"],
        interval: "5s",
        timeout: "5s",
        retries: 5,
      },
    };
    volumes.postgres_data = {};
  }

  // Backend service
  if (stack.backend === "node") {
    services.backend = {
      build: "./backend",
      ports: ["3001:3001"],
      environment: {
        NODE_ENV: "development",
        PORT: "3001",
        ...(stack.database === "postgres" && {
          DATABASE_URL: "postgresql://dev:dev@postgres:5432/layered_db",
        }),
      },
      depends_on: stack.database ? ["postgres"] : [],
      volumes: ["./backend:/app", "/app/node_modules"],
    };
  }

  // Frontend service
  if (stack.frontend === "nextjs") {
    services.frontend = {
      build: "./frontend",
      ports: ["3000:3000"],
      environment: {
        NODE_ENV: "development",
        NEXT_PUBLIC_API_URL: "http://localhost:3001",
      },
      depends_on: stack.backend ? ["backend"] : [],
      volumes: ["./frontend:/app", "/app/node_modules"],
    };
  }

  const compose = {
    version: "3.8",
    services,
    ...(Object.keys(volumes).length > 0 && { volumes }),
  };

  return `version: '3.8'\n\nservices:\n${Object.entries(compose.services)
    .map(([name, config]) => {
      const cfg = config as Record<string, unknown>;
      const lines = [`  ${name}:`];
      Object.entries(cfg).forEach(([key, value]) => {
        if (typeof value === "string") {
          lines.push(`    ${key}: ${value}`);
        } else if (key === "environment") {
          lines.push(`    environment:`);
          Object.entries(value as Record<string, string>).forEach(([k, v]) => {
            lines.push(`      ${k}: ${v}`);
          });
        } else if (key === "ports") {
          lines.push(`    ports:`);
          (value as string[]).forEach((p) => {
            lines.push(`      - ${p}`);
          });
        } else if (key === "volumes") {
          lines.push(`    volumes:`);
          (value as (string | { [key: string]: unknown })[]).forEach((v) => {
            if (typeof v === "string") {
              lines.push(`      - ${v}`);
            }
          });
        } else if (key === "depends_on") {
          if ((value as string[]).length > 0) {
            lines.push(`    depends_on:`);
            (value as string[]).forEach((d) => {
              lines.push(`      - ${d}`);
            });
          }
        } else if (key === "healthcheck") {
          const hc = value as {
            test: string[];
            interval: string;
            timeout: string;
            retries: number;
          };
          lines.push(`    healthcheck:`);
          lines.push(`      test: ${JSON.stringify(hc.test)}`);
          lines.push(`      interval: ${hc.interval}`);
          lines.push(`      timeout: ${hc.timeout}`);
          lines.push(`      retries: ${hc.retries}`);
        } else if (key === "build") {
          lines.push(`    build: ${value}`);
        }
      });
      return lines.join("\n");
    })
    .join("\n")}${
    Object.keys(volumes).length > 0
      ? `\n\nvolumes:\n${Object.entries(volumes)
          .map(([name]) => `  ${name}:`)
          .join("\n")}`
      : ""
  }\n`;
}
