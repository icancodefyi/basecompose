import type { StackBlueprint } from "@layered/types";
import { RESOLUTION_RULES } from "@layered/types";

export function resolveStack(input: StackBlueprint): StackBlueprint {
  const stack = { ...input };

  // Apply all resolution rules from config
  RESOLUTION_RULES.forEach((rule) => {
    if (rule.condition(stack)) {
      rule.apply(stack);
    }
  });

  return stack;
}
