import type { StackBlueprint } from "@layered/types";
import { getOptionConfig } from "@layered/types";

export function generateDockerCompose(stack: StackBlueprint): string {
  const services: Record<string, unknown> = {};
  const volumes: Record<string, unknown> = {};

  // Database service
  if (stack.database) {
    const dbConfig = getOptionConfig("database", stack.database);
    services[stack.database] = {
      image: dbConfig.dockerImage,
      environment: dbConfig.envVars || {},
      ports: [`${dbConfig.port}:${dbConfig.port}`],
      volumes: [`${stack.database}_data:/var/lib/${stack.database === "postgres" ? "postgresql" : stack.database}/data`],
      healthcheck: {
        test: ["CMD-SHELL", stack.database === "postgres" ? "pg_isready -U dev" : "mysqladmin ping -h localhost"],
        interval: "5s",
        timeout: "5s",
        retries: 5,
      },
    };
    volumes[`${stack.database}_data`] = {};
  }

  // Backend service
  if (stack.backend) {
    const backendConfig = getOptionConfig("backend", stack.backend);
    services.backend = {
      build: "./backend",
      ports: [`${backendConfig.port}:${backendConfig.port}`],
      environment: {
        NODE_ENV: "development",
        PORT: backendConfig.port.toString(),
        ...(stack.database && {
          DATABASE_URL: `postgresql://dev:dev@${stack.database}:${getOptionConfig("database", stack.database).port}/layered_db`,
        }),
      },
      depends_on: stack.database ? [stack.database] : [],
      volumes: ["./backend:/app", "/app/node_modules"],
    };
  }

  // Frontend service
  if (stack.frontend) {
    const frontendConfig = getOptionConfig("frontend", stack.frontend);
    services.frontend = {
      build: "./frontend",
      ports: [`${frontendConfig.port}:${frontendConfig.port}`],
      environment: {
        NODE_ENV: "development",
        NEXT_PUBLIC_API_URL: stack.backend ? `http://localhost:${getOptionConfig("backend", stack.backend).port}` : "",
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
