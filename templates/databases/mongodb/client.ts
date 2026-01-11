import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://root:example@localhost:27017";
export const client = new MongoClient(uri);

export async function connectMongo() {
  await client.connect();
  return client;
}
