import type { StackBlueprint } from "@layered/types";
import { resolveStack } from "./resolve";
import { generateDockerCompose } from "./emit/docker";
import { generateEnvExample } from "./emit/env";
import { generateReadme } from "./emit/readme";

export interface GeneratedFiles {
  "docker-compose.yml": string;
  ".env.example": string;
  "README.md": string;
}

export function generateStackFiles(
  input: StackBlueprint
): { stack: StackBlueprint; files: GeneratedFiles } {
  // Resolve the stack based on rules
  const stack = resolveStack(input);

  // Generate files
  const files: GeneratedFiles = {
    "docker-compose.yml": generateDockerCompose(stack),
    ".env.example": generateEnvExample(stack),
    "README.md": generateReadme(stack),
  };

  return { stack, files };
}
