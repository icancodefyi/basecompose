import { generateStackFiles } from "@layered/engine";
import type { StackBlueprint } from "@layered/types";
import JSZip from "jszip";

export async function POST(req: Request) {
  try {
    const blueprint: StackBlueprint = await req.json();

    // Generate files using the engine
    const { stack, files } = generateStackFiles(blueprint);

    // Create zip file
    const zip = new JSZip();
    
    // Add all generated files to zip
    Object.entries(files).forEach(([filename, content]) => {
      zip.file(filename, content);
    });

    // Generate zip blob
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Return zip as response
    return new Response(zipBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="layered-stack.zip"',
      },
    });
  } catch (error) {
    console.error("Generate error:", error);
    return Response.json(
      {
        error: "Failed to generate stack",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

