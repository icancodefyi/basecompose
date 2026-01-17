import type { StackBlueprint } from "@BaseCompose/types";
import { RESOLUTION_RULES } from "@BaseCompose/types";

export function resolveStack(input: StackBlueprint): StackBlueprint {
  const stack = { ...input };

  // Apply all resolution rules from config
  if (RESOLUTION_RULES.length > 0) {
    RESOLUTION_RULES.forEach((rule) => {
      if (rule.condition(stack)) {
        rule.apply(stack);
      }
    });
  }

  return stack;
}
