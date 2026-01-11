import { resolveStack } from "@layered/engine";

export async function POST(req: Request) {
  const blueprint = await req.json();
  const resolved = resolveStack(blueprint);

  return Response.json(resolved);
}
