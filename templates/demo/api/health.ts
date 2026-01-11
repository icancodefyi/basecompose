import { connectMongo } from "@/lib/db/mongodb";

export async function GET() {
  const features = {
    nextjs: true,
    database: false,
    auth: false,
    timestamp: new Date().toISOString(),
  };

  // Check if MongoDB is available
  try {
    const client = await connectMongo();
    const admin = client.db("admin");
    await admin.command({ ping: 1 });
    features.database = true;
  } catch (err) {
    // MongoDB not configured
  }

  return Response.json({ status: "ok", features });
}
