import { generateProject } from "@BaseCompose/engine";
import type { StackBlueprint } from "@BaseCompose/types";

export async function POST(req: Request) {
  try {
    const blueprint: StackBlueprint = await req.json();

    console.log("📝 Received blueprint:", blueprint);

    // Generate the full project as a tar.gz archive
    const buffer = await generateProject(blueprint);

    // Return as downloadable archive
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": 'attachment; filename="BaseCompose-stack.tar.gz"',
      },
    });
  } catch (error) {
    console.error("Generate error:", error);
    return Response.json(
      {
        error: "Failed to generate project",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

