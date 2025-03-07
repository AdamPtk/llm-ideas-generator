import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

const MONGODB_URI = process.env.MONGODB_URI;

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: Cached | undefined;
}

let cached: Cached = global.mongoose || { conn: null, promise: null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
      console.log("Connected to MongoDB");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Error connecting to MongoDB:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
