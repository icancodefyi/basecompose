import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        if (!email || typeof email !== "string" || !email.includes("@")) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }
        // Save to MongoDB
        const { db } = await connectToDatabase();
        
        const existing = await db.collection("subscribers").findOne({ email });
        if (existing) {
            return NextResponse.json({ error: "Email already subscribed" }, { status: 409 });
        }
        
        await db.collection("subscribers").insertOne({ email, createdAt: new Date() });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
