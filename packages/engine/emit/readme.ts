import type { StackBlueprint } from "@BaseCompose/types";

export function generateReadme(stack: StackBlueprint): string {
  const lines: string[] = ["# BaseCompose Stack"];

  lines.push("\nGenerated stack for " + stack.intent + " application.");

  lines.push("\n## Stack");
  if (stack.frontend) lines.push(`- Frontend: ${stack.frontend}`);
  if (stack.backend) lines.push(`- Backend: ${stack.backend}`);
  if (stack.database) lines.push(`- Database: ${stack.database}`);
  if (stack.auth) lines.push(`- Auth: ${stack.auth}`);

  lines.push("\n## Quick Start");
  lines.push("\n```bash");
  lines.push("# Install dependencies");
  lines.push("pnpm install");
  lines.push("\n# Start services");
  lines.push("docker compose up -d");
  lines.push("\n# Run development server");
  lines.push("pnpm dev");
  lines.push("```");

  lines.push("\n## Services");

  if (stack.frontend === "nextjs") {
    lines.push("\n### Frontend (Next.js)");
    lines.push("Running on http://localhost:3000");
  }

  if (stack.backend === "node") {
    lines.push("\n### Backend (Node)");
    lines.push("Running on http://localhost:3001");
  }

  if (stack.database === "postgres") {
    lines.push("\n### Database (PostgreSQL)");
    lines.push("- Host: localhost");
    lines.push("- Port: 5432");
    lines.push("- User: dev");
    lines.push("- Password: dev");
    lines.push("- Database: BaseCompose_db");
  }

  lines.push("\n## Environment Variables");
  lines.push("\nCopy `.env.example` to `.env.local` and adjust as needed.");

  lines.push("\n## Development");
  lines.push("\n```bash");
  lines.push("# Watch mode");
  lines.push("pnpm dev");
  lines.push("\n# Build");
  lines.push("pnpm build");
  lines.push("\n# Run production");
  lines.push("pnpm start");
  lines.push("```");

  lines.push("\n## Docker Compose");
  lines.push("\n```bash");
  lines.push("# Start services");
  lines.push("docker compose up -d");
  lines.push("\n# View logs");
  lines.push("docker compose logs -f");
  lines.push("\n# Stop services");
  lines.push("docker compose down");
  lines.push("```");

  return lines.join("\n") + "\n";
}
