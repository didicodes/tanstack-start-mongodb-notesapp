// Database and collection names
export const DB_NAME = "notes-app";
export const COLLECTION_NAME = "notes";

// Connection pool configuration optimized for serverless
export const MONGODB_CONNECTION_CONFIG = {
  maxPoolSize: 10, // Maximum connections in pool
  minPoolSize: 1, // Minimum connections to maintain
  maxIdleTimeMS: 5000, // Close idle connections after 5s
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000,
} as const;
