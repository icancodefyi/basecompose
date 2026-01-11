import type { StackBlueprint } from "@layered/types";

export function resolveStack(
  input: StackBlueprint
): StackBlueprint {
  const stack = { ...input };

  if (stack.auth && !stack.database) {
    stack.database = "postgres";
  }

  if (stack.frontend === "nextjs" && !stack.backend) {
    stack.backend = "node";
  }

  return stack;
}
