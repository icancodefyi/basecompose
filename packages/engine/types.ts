import type { StackBlueprint } from "@layered/types";

export type GenerationContext = {
  outDir: string;
  framework: "nextjs";
  addons: Array<"mongodb" | "authjs" | "demo">;
  blueprint: StackBlueprint;
};

export type CollectedEnv = Record<string, string>;
export type DockerFragments = Record<string, Record<string, unknown>>;

export interface GenerationState {
  context: GenerationContext;
  env: CollectedEnv;
  dockerFragments: DockerFragments;
  dockerVolumes: Record<string, unknown>;
  addonNotes: string[];
}
