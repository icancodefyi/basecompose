import type { StackBlueprint } from "@layered/types";

export function resolveStack(
  input: StackBlueprint
): StackBlueprint {
  const stack = { ...input };

  // Rule 1: auth implies postgres
  if (stack.auth && !stack.database) {
    stack.database = "postgres";
  }

  // Rule 2: nextjs frontend implies node backend
  if (stack.frontend === "nextjs" && !stack.backend) {
    stack.backend = "node";
  }

  return stack;
}
