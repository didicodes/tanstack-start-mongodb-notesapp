// Database and collection names
export const DB_NAME = "notes-app";
export const COLLECTION_NAME = "notes";

// Connection pool configuration optimized for serverless
export const MONGODB_CONNECTION_CONFIG = {
  minPoolSize: 1,
  maxIdleTimeMS: 60000,
} as const;
