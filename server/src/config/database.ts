import mongoose from 'mongoose';
import { env } from './env';

/**
 * Opens the connection to MongoDB Atlas.
 * Throws an error if it cannot connect within 10 seconds.
 */
export async function connectDatabase(): Promise<void> {
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB connection lost. Mongoose will try to reconnect.');
  });

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10_000,
  });

  console.log(`Connected to MongoDB (database: ${mongoose.connection.name})`);
}