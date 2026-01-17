import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/basecompose';
const DB_NAME = 'basecompose';

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DB_NAME);
    
    // Create indexes
    await db.collection('projects').createIndex({ userId: 1, lastMessageAt: -1 });
    await db.collection('projects').createIndex({ _id: 1 });
    await db.collection('chat_messages').createIndex({ projectId: 1, timestamp: 1 });
    
    cachedClient = client;
    cachedDb = db;

    console.log('✓ Connected to MongoDB');
    
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}
