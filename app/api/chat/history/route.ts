import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/chat/history?projectId=xxx - Load chat history
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'projectId required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const messagesCollection = db.collection('chat_messages');

    const messages = await messagesCollection
      .find({ projectId })
      .sort({ timestamp: 1 })
      .toArray();

    return NextResponse.json({
      messages: messages.map(m => ({
        ...m,
        _id: m._id.toString()
      }))
    });
  } catch (error) {
    console.error('GET /api/chat/history error:', error);
    return NextResponse.json({ error: 'Failed to load chat history' }, { status: 500 });
  }
}

// POST /api/chat/history - Save message
export async function POST(req: NextRequest) {
  try {
    const { projectId, role, content, blueprint } = await req.json();

    if (!projectId || !role || !content) {
      return NextResponse.json({ error: 'projectId, role, and content required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const messagesCollection = db.collection('chat_messages');
    const projectsCollection = db.collection('projects');

    const message = {
      projectId,
      role,
      content,
      blueprint: blueprint || undefined,
      timestamp: new Date().toISOString()
    };

    const result = await messagesCollection.insertOne(message);

    // Update project's lastMessageAt
    await projectsCollection.updateOne(
      { _id: new ObjectId(projectId) },
      {
        $set: {
          lastMessageAt: message.timestamp,
          ...(blueprint && { blueprint })
        }
      }
    );

    return NextResponse.json({
      message: { ...message, _id: result.insertedId.toString() }
    });
  } catch (error) {
    console.error('POST /api/chat/history error:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
