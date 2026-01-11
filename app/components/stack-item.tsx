"use client";

import Image from "next/image";
import { getTechIcon } from "@/lib/icons";

interface StackItemProps {
  label: string;
  value?: string;
  iconKey?: string;
  onRemove?: () => void;
}

export function StackItem({ label, value, iconKey, onRemove }: StackItemProps) {
	if (!value) return null;

	const iconUrl = iconKey ? getTechIcon(iconKey) : undefined;
	const validIconUrl = typeof iconUrl === "string" && iconUrl.length > 0 ? iconUrl : undefined;

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 animate-in fade-in slide-in-from-right-2 group">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          {validIconUrl && (
            <Image src={validIconUrl} alt={value} width={24} height={24} />
          )}
          <div className="flex-1">
            <span className="text-xs text-[#666666]">{label}</span>
            <div className="text-xs font-mono font-medium text-[#0088ff]">{value}</div>
          </div>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="ml-2 p-1.5 rounded text-[#666666] hover:text-red-500 hover:bg-[#2a2a2a] opacity-0 group-hover:opacity-100 transition-all"
            title={`Remove ${label}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
