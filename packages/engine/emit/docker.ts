import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import type { GenerationState, DockerFragments } from "../types";

/**
 * Load docker-compose fragment from addon
 */
export function loadDockerFragment(
  addon: string,
  templatesRoot: string
): DockerFragments {
  let fragmentPath: string;

  if (addon === "mongodb") {
    fragmentPath = path.join(
      templatesRoot,
      "databases/mongodb/docker/docker-compose.mongo.yml"
    );
  } else if (addon === "authjs") {
    // Auth.js doesn't need a docker service
    return {};
  } else if (addon === "demo") {
    // Demo doesn't need a docker service
    return {};
  } else {
    throw new Error(`Unknown addon: ${addon}`);
  }

  if (!fs.existsSync(fragmentPath)) {
    console.warn(`Docker fragment not found: ${fragmentPath}`);
    return {};
  }

  try {
    const content = fs.readFileSync(fragmentPath, "utf-8");
    const parsed = yaml.load(content) as Record<string, unknown>;
    return parsed || {};
  } catch (err) {
    console.warn(`Error parsing docker fragment ${fragmentPath}:`, err);
    return {};
  }
}

/**
 * Collect docker fragments from all addons
 */
export function collectDockerFragments(state: GenerationState) {
  const templatesRoot = path.resolve(process.cwd(), "templates");

  for (const addon of state.context.addons) {
    const fragment = loadDockerFragment(addon, templatesRoot);
    // Merge fragment into state
    state.dockerFragments = { ...state.dockerFragments, ...fragment };
  }

  console.log(`✓ Collected docker fragments:`, Object.keys(state.dockerFragments));
}

/**
 * Collect volumes from docker fragments
 */
export function collectDockerVolumes(state: GenerationState) {
  // MongoDB adds a volume
  if (state.context.addons.includes("mongodb")) {
    state.dockerVolumes.mongo_data = {};
  }

  console.log(`✓ Collected volumes:`, Object.keys(state.dockerVolumes));
}

/**
 * Merge docker fragments into base compose file
 */
export function mergeDockerCompose(state: GenerationState): string {
  const baseCompose = {
    version: "3.8" as const,
    services: {
      app: {
        build: ".",
        ports: ["3000:3000"],
        environment: {
          NODE_ENV: "development"
        }
      }
    }
  };

  // Merge addon service fragments
  for (const [serviceName, serviceConfig] of Object.entries(
    state.dockerFragments
  )) {
    baseCompose.services[serviceName] = serviceConfig;
  }

  // Add volumes if any
  if (Object.keys(state.dockerVolumes).length > 0) {
    (baseCompose as any).volumes = state.dockerVolumes;
  }

  // Convert to YAML
  return yaml.dump(baseCompose, { lineWidth: -1 });
}

/**
 * Write docker-compose.yml to output directory
 */
export function writeDockerCompose(state: GenerationState) {
  const compose = mergeDockerCompose(state);
  const composePath = path.join(state.context.outDir, "docker-compose.yml");

  fs.writeFileSync(composePath, compose, "utf-8");
  console.log(`✓ docker-compose.yml written`);
}
