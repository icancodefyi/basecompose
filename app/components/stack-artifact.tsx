"use client";

import type { StackBlueprint } from "@BaseCompose/types";
import { STACK_CONFIG } from "@BaseCompose/types";
import { getIconComponent } from "@/lib/icons/index";

interface StackArtifactProps {
  stack: StackBlueprint;
}

export function StackArtifact({ stack }: StackArtifactProps) {
  const items = [
    { key: "frontend", label: "Frontend", value: stack.frontend },
    { key: "backend", label: "Backend", value: stack.backend },
    { key: "database", label: "Database", value: stack.database },
    { key: "auth", label: "Auth", value: stack.auth },
  ].filter((item) => item.value);

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const categoryKey = item.key as keyof typeof STACK_CONFIG;
        const categoryConfig = STACK_CONFIG[categoryKey];

        const options = categoryConfig?.options as Record<string, any> | undefined;
        const optionConfig = options?.[item.value as string];
        const iconKey = optionConfig?.icon as string | undefined;
        const IconComponent = iconKey ? getIconComponent(iconKey) : undefined;

        return (
          <div
            key={item.key}
            className="flex items-center gap-3 p-3 rounded-lg bg-background border border-[#2a2a2a]"
          >
            {IconComponent && (
              <div className="text-[#01AE74]">
                <IconComponent className="w-8 h-8" />
              </div>
            )}
            <div className="flex-1">
              <div className="text-xs text-[#666666] uppercase tracking-wider">{item.label}</div>
              <div className="text-sm font-medium text-foreground">{item.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
