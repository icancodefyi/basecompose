import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/projects - List user's projects
// GET /api/projects?projectId=xxx - Get specific project
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const projectsCollection = db.collection('projects');

    if (projectId) {
      const project = await projectsCollection.findOne({
        _id: new ObjectId(projectId),
        userId
      });

      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      return NextResponse.json({ project: { ...project, _id: project._id.toString() } });
    }

    // List all projects
    const projects = await projectsCollection
      .find({ userId })
      .sort({ lastMessageAt: -1 })
      .toArray();

    return NextResponse.json({
      projects: projects.map(p => ({ ...p, _id: p._id.toString() }))
    });
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST /api/projects - Create new project
export async function POST(req: NextRequest) {
  try {
    const { name, userId } = await req.json();

    if (!name || !userId) {
      return NextResponse.json({ error: 'name and userId required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const projectsCollection = db.collection('projects');

    const now = new Date().toISOString();
    const project = {
      name,
      userId,
      blueprint: null,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now
    };

    const result = await projectsCollection.insertOne(project);

    return NextResponse.json({
      project: { ...project, _id: result.insertedId.toString() }
    });
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

// PUT /api/projects - Update project
export async function PUT(req: NextRequest) {
  try {
    const { projectId, blueprint, status } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: 'projectId required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const projectsCollection = db.collection('projects');

    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (blueprint !== undefined) updateData.blueprint = blueprint;
    if (status) updateData.status = status;

    const result = await projectsCollection.updateOne(
      { _id: new ObjectId(projectId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT /api/projects error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE /api/projects
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'projectId required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Delete project and all its messages
    await db.collection('projects').deleteOne({ _id: new ObjectId(projectId) });
    await db.collection('chat_messages').deleteMany({ projectId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/projects error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
