import { MongoClient, type Collection, type Db } from "mongodb";
import {
  COLLECTION_NAME,
  DB_NAME,
  MONGODB_CONNECTION_CONFIG,
} from "../config/mongodb";
import type { NoteResponse } from "./types";

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global cache for MongoDB client
 * This survives across serverless function invocations
 */
interface CachedConnection {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<{ client: MongoClient; db: Db }> | null;
}

const cached: CachedConnection = {
  client: null,
  db: null,
  promise: null,
};

/**
 * Get or create a MongoDB connection
 *
 * This is the heart of our serverless optimization.
 * It implements a three-tier caching strategy:
 *
 * 1. Return existing connection if available (fastest)
 * 2. Wait for in-flight connection if one is being created (prevents duplicates)
 * 3. Create new connection if neither exists (slowest, but necessary)
 */
export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  // Tier 1: Return cached connection if available
  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db };
  }

  // Tier 2: Return in-flight connection promise if exists
  // This prevents multiple simultaneous connection attempts
  if (cached.promise) {
    return cached.promise;
  }

  // Validate connection string
  if (!MONGODB_URI) {
    throw new Error(
      "Missing MONGODB_URI environment variable. " +
        "Please add it to your .env file."
    );
  }

  // Tier 3: Create a new connection
  cached.promise = MongoClient.connect(MONGODB_URI, {
    appName: "tanstack-notes-app",
    ...MONGODB_CONNECTION_CONFIG,
  })
    .then((client) => {
      const db = client.db(DB_NAME);

      cached.client = client;
      cached.db = db;
      cached.promise = null; // Clear promise since we're done

      return { client, db };
    })
    .catch((error) => {
      // Reset promise on error to allow retry
      cached.promise = null;
      throw error;
    });

  return cached.promise;
}

/**
 * Get typed collection accessor
 *
 * This provides type-safe access to MongoDB collections.
 * The NoteResponse type ensures we get proper TypeScript
 * autocomplete and type checking.
 */
export async function getNotesCollection(): Promise<Collection<NoteResponse>> {
  const { db } = await connectToDatabase();
  return db.collection<NoteResponse>(COLLECTION_NAME);
}
