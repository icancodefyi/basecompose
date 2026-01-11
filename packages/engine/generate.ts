import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { promisify } from "util";
import { pipeline } from "stream";
import * as zlib from "zlib";
import * as tar from "tar";
import type { StackBlueprint } from "@layered/types";
import type { GenerationContext, GenerationState } from "./types";
import { copyFrameworkBase, copyAddonFiles } from "./copy";
import { collectAddonEnv, writeEnvExample } from "./emit/env";
import {
  collectDockerFragments,
  collectDockerVolumes,
  writeDockerCompose,
} from "./emit/docker";

const pipelineAsync = promisify(pipeline);

/**
 * Determine which addons to apply based on blueprint
 */
function determineAddons(blueprint: StackBlueprint): Array<"mongodb" | "authjs" | "demo"> {
  const addons: Array<"mongodb" | "authjs" | "demo"> = [];

  if (blueprint.database === "mongodb") {
    addons.push("mongodb");
  }

  if (blueprint.auth === "authjs") {
    addons.push("authjs");
  }

  // Always include demo for v1
  addons.push("demo");

  return addons;
}

/**
 * Main generation pipeline
 */
export async function generateProject(
  blueprint: StackBlueprint
): Promise<Buffer> {
  // Create temp directory
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "layered-"));
  const outDir = path.join(tmpDir, "project");

  try {
    console.log(`📦 Generating project in ${tmpDir}`);

    // Create generation context
    const context: GenerationContext = {
      outDir,
      framework: "nextjs",
      addons: determineAddons(blueprint),
      blueprint,
    };

    // Initialize generation state
    const state: GenerationState = {
      context,
      env: {},
      dockerFragments: {},
      dockerVolumes: {},
      addonNotes: [],
    };

    // Step 1: Copy framework base
    console.log("📋 Copying Next.js base...");
    copyFrameworkBase(state);

    // Step 2: Apply addons
    console.log("🔌 Applying addons...");
    for (const addon of context.addons) {
      copyAddonFiles(state, addon);
    }

    // Step 3: Collect and merge docker compose
    console.log("🐳 Merging Docker Compose...");
    collectDockerFragments(state);
    collectDockerVolumes(state);
    writeDockerCompose(state);

    // Step 4: Collect and emit env example
    console.log("🔐 Generating environment variables...");
    collectAddonEnv(state);
    writeEnvExample(state);

    // Step 5: Create a .gitignore if it doesn't exist
    const gitignorePath = path.join(outDir, ".gitignore");
    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(
        gitignorePath,
        "node_modules/\n.next/\n.env.local\n.env*.local\n.DS_Store\n",
        "utf-8"
      );
    }

    // Step 6: Copy setup guide
    console.log("📚 Copying setup guide...");
    const templatesRoot = path.resolve(process.cwd(), "templates");
    const setupGuideSrc = path.join(templatesRoot, "shared/README_SETUP.md");
    const setupGuideDest = path.join(outDir, "SETUP.md");
    if (fs.existsSync(setupGuideSrc)) {
      fs.copyFileSync(setupGuideSrc, setupGuideDest);
    }

    // Step 7: Zip the output
    console.log("📦 Creating zip archive...");
    const zipPath = path.join(tmpDir, "project.tar.gz");
    
    // Use tar to create a gzipped archive
    await tar.create(
      {
        gzip: true,
        file: zipPath,
        cwd: tmpDir,
      },
      ["project"]
    );

    // Read the zip into a buffer
    const buffer = fs.readFileSync(zipPath);

    console.log("✨ Generation complete!");

    return buffer;
  } finally {
    // Cleanup temp directory
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}
