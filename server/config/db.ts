import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ENV } from './env.js';
import { seedDatabase } from '../seed/seedDatabase.js';

let mongod: MongoMemoryServer | null = null;

export const connectDB = async () => {
  try {
    let mongoUri = ENV.MONGO_URI;

    if (!mongoUri) {
      console.log('⚡ Initializing in-memory MongoDB engine for Campus Coin...');
      mongod = await MongoMemoryServer.create({
        instance: {
          dbName: 'campus_coin'
        }
      });
      mongoUri = mongod.getUri() + 'campus_coin';
      console.log(`✅ In-memory MongoDB running at: ${mongoUri}`);
    }

    await mongoose.connect(mongoUri);
    console.log(` MongoDB Connected: ${mongoose.connection.host}/${mongoose.connection.name}`);

    // Automatically seed initial data if empty
    await seedDatabase();

  } catch (error: any) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err: any) {
    console.error('Error closing DB:', err.message);
  }
};
