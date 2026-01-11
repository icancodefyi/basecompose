import type { StackBlueprint } from "@layered/types";

export function generateEnvExample(stack: StackBlueprint): string {
  const lines: string[] = ["# Layered Stack Configuration"];

  lines.push("\n# Environment");
  lines.push("NODE_ENV=development");

  if (stack.frontend === "nextjs") {
    lines.push("\n# Frontend (Next.js)");
    lines.push("NEXT_PUBLIC_API_URL=http://localhost:3001");
  }

  if (stack.backend === "node") {
    lines.push("\n# Backend (Node)");
    lines.push("PORT=3001");
  }

  if (stack.database === "postgres") {
    lines.push("\n# Database (PostgreSQL)");
    lines.push("DATABASE_URL=postgresql://dev:dev@localhost:5432/layered_db");
  }

  if (stack.auth === "authjs") {
    lines.push("\n# Authentication (Auth.js)");
    lines.push("NEXTAUTH_SECRET=your-secret-here-change-in-production");
    lines.push("NEXTAUTH_URL=http://localhost:3000");
  }

  return lines.join("\n") + "\n";
}
