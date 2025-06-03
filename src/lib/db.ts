import { MongoClient, ObjectId } from 'mongodb';

if (!process.env.DATABASE_URL) {
  throw new Error('Please add your DATABASE_URL to .env');
}

const uri = process.env.DATABASE_URL;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Database collections
export const collections = {
  users: 'users',
  documents: 'documents',
};

// Helper function to get database instance
export async function getDb() {
  const client = await clientPromise;
  return client.db();
}

// Helper function to convert string ID to ObjectId
export function toObjectId(id: string): ObjectId {
  return new ObjectId(id);
}

// Export the client promise
export default clientPromise; 