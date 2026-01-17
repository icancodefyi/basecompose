export type { StackBlueprint } from "./blueprint";
export { STACK_CONFIG, RESOLUTION_RULES, getOptions, getOptionConfig } from "./stack-config";
export type { StackCategory, StackOption } from "./stack-config";

// Project and Chat types
export interface Project {
  _id?: string;
  name: string;
  userId: string;
  blueprint: StackBlueprint | null;
  status: 'active' | 'generated' | 'archived';
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
}

export interface ChatMessage {
  _id?: string;
  projectId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  blueprint?: StackBlueprint;
  timestamp: string;
}
