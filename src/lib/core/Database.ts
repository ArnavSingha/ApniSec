
import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Extend the NodeJS Global type to include our mongoose cache
declare global {
  var mongooseCache: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

/**
 * A singleton class to manage MongoDB connections.
 * This pattern is crucial in a serverless environment like Next.js to prevent
 * creating too many database connections, especially during development with hot-reloading.
 */
export class Database {
  private static instance: Database;
  private connection: Mongoose | null = null;
  private connectionPromise: Promise<Mongoose> | null = null;

  private constructor() {
    // Initialize from global cache if it exists
    if (global.mongooseCache) {
      this.connection = global.mongooseCache.conn;
      this.connectionPromise = global.mongooseCache.promise;
    } else {
      global.mongooseCache = { conn: null, promise: null };
    }
  }

  /**
   * Gets the singleton instance of the Database class.
   */
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Establishes a connection to the MongoDB database.
   * It uses a cached connection if one already exists or is in the process of connecting.
   * @returns A promise that resolves to the Mongoose connection instance.
   */
  public async connect(): Promise<Mongoose> {
    if (this.connection) {
      return this.connection;
    }

    if (!this.connectionPromise) {
      const opts = {
        bufferCommands: false,
      };

      console.log('Attempting to connect to MongoDB...');
      this.connectionPromise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
        console.log('MongoDB connection successful.');
        return mongooseInstance;
      });
      global.mongooseCache.promise = this.connectionPromise;
    }

    try {
      this.connection = await this.connectionPromise;
      global.mongooseCache.conn = this.connection;
    } catch (e: any) {
      // If connection fails, clear the promise to allow for a retry.
      this.connectionPromise = null;
      global.mongooseCache.promise = null;
      console.error('MongoDB connection failed:', e.message);
      throw e; // Re-throw the original error after logging
    }

    return this.connection;
  }

  /**
   * A static shortcut method to get the Mongoose connection instance.
   * @returns A promise that resolves to the Mongoose connection instance.
   */
  public static async getConnection(): Promise<Mongoose> {
    return Database.getInstance().connect();
  }
}
