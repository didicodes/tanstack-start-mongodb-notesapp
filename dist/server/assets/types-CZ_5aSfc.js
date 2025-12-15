import { MongoClient } from "mongodb";
import { z } from "zod";
const DB_NAME = "notes-app";
const COLLECTION_NAME = "notes";
const MONGODB_CONNECTION_CONFIG = {
  maxPoolSize: 10,
  // Maximum connections in pool
  minPoolSize: 1,
  // Minimum connections to maintain
  maxIdleTimeMS: 5e3,
  // Close idle connections after 5s
  serverSelectionTimeoutMS: 5e3,
  socketTimeoutMS: 3e4
};
const MONGODB_URI = process.env.MONGODB_URI;
const cached = {
  client: null,
  db: null,
  promise: null
};
function getConnectionErrorMessage(error) {
  const errorMsg = error.message.toLowerCase();
  if (errorMsg.includes("bad auth") || errorMsg.includes("authentication failed")) {
    return "Authentication failed. Check your MongoDB credentials.";
  }
  if (errorMsg.includes("enotfound") || errorMsg.includes("getaddrinfo")) {
    return "Cannot reach MongoDB server. Check your connection string.";
  }
  if (errorMsg.includes("timeout") || errorMsg.includes("timed out")) {
    return "Connection timeout. MongoDB server may be down or unreachable.";
  }
  if (errorMsg.includes("ip") && errorMsg.includes("whitelist")) {
    return "IP address not whitelisted in MongoDB Atlas.";
  }
  if (errorMsg.includes("invalid connection string") || errorMsg.includes("uri must")) {
    return "Invalid MongoDB connection string format.";
  }
  if (errorMsg.includes("server selection")) {
    return "Cannot connect to MongoDB. Server may be down.";
  }
  return `MongoDB connection error: ${error.message}`;
}
async function connectToDatabase() {
  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db };
  }
  if (cached.promise) {
    return cached.promise;
  }
  if (!MONGODB_URI) {
    throw new Error(
      "Missing MONGODB_URI environment variable. Please add it to your .env file."
    );
  }
  cached.promise = MongoClient.connect(MONGODB_URI, {
    appName: "tanstack-notes-app",
    ...MONGODB_CONNECTION_CONFIG
  }).then((client) => {
    const db = client.db(DB_NAME);
    cached.client = client;
    cached.db = db;
    cached.promise = null;
    return { client, db };
  }).catch((error) => {
    cached.promise = null;
    const message = getConnectionErrorMessage(error);
    throw new Error(message);
  });
  return cached.promise;
}
async function getNotesCollection() {
  const { db } = await connectToDatabase();
  return db.collection(COLLECTION_NAME);
}
const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
  content: z.string().max(1e4, "Content must be 10,000 characters or less")
});
const updateNoteSchema = z.object({
  id: z.string().min(1, "Note ID is required"),
  title: z.string().min(1).max(200).optional(),
  content: z.string().max(1e4).optional()
});
const deleteNoteSchema = z.object({
  id: z.string().min(1, "Note ID is required")
});
function documentToNote(doc) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    content: doc.content,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
}
export {
  deleteNoteSchema as a,
  createNoteSchema as c,
  documentToNote as d,
  getNotesCollection as g,
  updateNoteSchema as u
};
