import { MongoClient } from "mongodb";
import { MONGO_DB_URI } from "./const";

// Initialize MongoDB client
const client = new MongoClient(MONGO_DB_URI);
client.connect();
const db = client.db("real_estate_bot_db");
export const usersCollection = db.collection("users");

export async function getUsageCount(userId: number): Promise<number> {
  // Check if user exists in the database
  const user = await usersCollection.findOne({ userId });
  if (!user) {
    // If user doesn't exist, add them to the database
    await usersCollection.insertOne({ userId, usageCount: 0 });
    return 0;
  }
  return user.usageCount || 0;
}

export async function getCreditsAvailable(userId: number): Promise<number> {
  // Check if user exists in the database
  const user = await usersCollection.findOne({ userId });
  if (!user) {
    // If user doesn't exist, add them to the database
    await usersCollection.insertOne({ userId, creditsAvailable: 0 });
    return 0;
  }
  return user.creditsAvailable || 0;
}
