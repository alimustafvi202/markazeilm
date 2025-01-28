import importModels from "@/models";
import mongoose from "mongoose";
const MONGODB_URL = process.env.DB_URI;

if (!MONGODB_URL) {
  throw new Error("Set the environmental variable.");
}
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { con: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  importModels();

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  console.log("db connected successfully");

  return cached.conn;
};

export default connectDB;
