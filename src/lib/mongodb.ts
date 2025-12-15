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
 * Parse MongoDB errors into user-friendly messages
 */
function getConnectionErrorMessage(error: Error): string {
  const errorMsg = error.message.toLowerCase();

  // Authentication errors
  if (
    errorMsg.includes("bad auth") ||
    errorMsg.includes("authentication failed")
  ) {
    return "Authentication failed. Check your MongoDB credentials.";
  }

  // Network/DNS errors
  if (errorMsg.includes("enotfound") || errorMsg.includes("getaddrinfo")) {
    return "Cannot reach MongoDB server. Check your connection string.";
  }

  // Timeout errors
  if (errorMsg.includes("timeout") || errorMsg.includes("timed out")) {
    return "Connection timeout. MongoDB server may be down or unreachable.";
  }

  // IP whitelist errors (common with MongoDB Atlas)
  if (errorMsg.includes("ip") && errorMsg.includes("whitelist")) {
    return "IP address not whitelisted in MongoDB Atlas.";
  }

  // Connection string format errors
  if (
    errorMsg.includes("invalid connection string") ||
    errorMsg.includes("uri must")
  ) {
    return "Invalid MongoDB connection string format.";
  }

  // Server selection errors
  if (errorMsg.includes("server selection")) {
    return "Cannot connect to MongoDB. Server may be down.";
  }

  // Generic fallback
  return `MongoDB connection error: ${error.message}`;
}

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

  // Tier 3: Create a new connection with error handling
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
      cached.promise = null;
      const message = getConnectionErrorMessage(error);
      throw new Error(message);
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
