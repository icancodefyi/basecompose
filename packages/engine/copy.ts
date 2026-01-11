import * as fs from "fs";
import * as path from "path";
import type { GenerationState } from "./types";

/**
 * Recursively copy a directory
 */
export function copyDir(src: string, dest: string) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Copy framework base (Next.js) to output directory
 */
export function copyFrameworkBase(state: GenerationState) {
  const templatesRoot = path.resolve(process.cwd(), "templates");
  const frameworkBase = path.join(templatesRoot, "frameworks/nextjs/base");
  const dockerDir = path.join(templatesRoot, "frameworks/nextjs/docker");

  if (!fs.existsSync(frameworkBase)) {
    throw new Error(`Framework template not found: ${frameworkBase}`);
  }

  copyDir(frameworkBase, state.context.outDir);
  console.log(`✓ Framework base copied to ${state.context.outDir}`);

  // Copy Docker files to root
  if (fs.existsSync(dockerDir)) {
    const dockerfileSrc = path.join(dockerDir, "Dockerfile");
    const dockerfileDest = path.join(state.context.outDir, "Dockerfile");
    const dockerignoreSrc = path.join(dockerDir, ".dockerignore");
    const dockerignoreDest = path.join(state.context.outDir, ".dockerignore");

    if (fs.existsSync(dockerfileSrc)) {
      fs.copyFileSync(dockerfileSrc, dockerfileDest);
      console.log(`✓ Dockerfile copied`);
    }

    if (fs.existsSync(dockerignoreSrc)) {
      fs.copyFileSync(dockerignoreSrc, dockerignoreDest);
      console.log(`✓ .dockerignore copied`);
    }
  }
}

/**
 * Copy addon files to their correct locations
 */
export function copyAddonFiles(state: GenerationState, addon: string) {
  const templatesRoot = path.resolve(process.cwd(), "templates");
  let addonPath: string;

  if (addon === "mongodb") {
    addonPath = path.join(templatesRoot, "databases/mongodb");
  } else if (addon === "authjs") {
    addonPath = path.join(templatesRoot, "auth/authjs");
  } else if (addon === "demo") {
    addonPath = path.join(templatesRoot, "demo");
  } else {
    throw new Error(`Unknown addon: ${addon}`);
  }

  if (!fs.existsSync(addonPath)) {
    throw new Error(`Addon template not found: ${addonPath}`);
  }

  // Addon-specific file placement logic
  if (addon === "mongodb") {
    // Copy client.ts to app/lib/db
    const clientSrc = path.join(addonPath, "client.ts");
    const clientDest = path.join(state.context.outDir, "app/lib/db/mongodb.ts");
    fs.mkdirSync(path.dirname(clientDest), { recursive: true });
    fs.copyFileSync(clientSrc, clientDest);
  } else if (addon === "authjs") {
    // Copy routes to app/api/auth
    const routesSrc = path.join(addonPath, "routes");
    const routesDest = path.join(
      state.context.outDir,
      "app/api/auth/[...nextauth]"
    );
    copyDir(routesSrc, routesDest);

    // Copy config to app/lib/auth
    const configSrc = path.join(addonPath, "config.ts");
    const configDest = path.join(state.context.outDir, "app/lib/auth/config.ts");
    fs.mkdirSync(path.dirname(configDest), { recursive: true });
    fs.copyFileSync(configSrc, configDest);
  } else if (addon === "demo") {
    // Copy api/health to app/api/health
    const healthSrc = path.join(addonPath, "api/health.ts");
    const healthDest = path.join(state.context.outDir, "app/api/health/route.ts");
    fs.mkdirSync(path.dirname(healthDest), { recursive: true });
    fs.copyFileSync(healthSrc, healthDest);

    // Copy ui component to app/lib/components/demo-hero.tsx
    const uiSrc = path.join(addonPath, "ui/page.tsx");
    const uiDest = path.join(
      state.context.outDir,
      "app/lib/components/demo-hero.tsx"
    );
    fs.mkdirSync(path.dirname(uiDest), { recursive: true });
    fs.copyFileSync(uiSrc, uiDest);
  }

  console.log(`✓ Addon files copied: ${addon}`);
}
