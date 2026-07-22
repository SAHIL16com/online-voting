import mongoose from 'mongoose';

const connectDB = async () => {
  let uri = process.env.MONGO_URI;

  if (uri && uri.includes('<db_password>')) {
    console.warn('[DB Warning] MONGO_URI contains <db_password> placeholder. Using MongoMemoryServer fallback...');
    uri = null;
  }

  if (uri) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`[DB Success] Connected to MongoDB`);
      return;
    } catch (error) {
      console.error(`[DB Connection Error] Could not connect to primary MONGO_URI (${error.message}). Trying fallback...`);
    }
  }

  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    const conn = await mongoose.connect(mongoUri);
    console.log(`[DB Success] In-Memory MongoDB Connected at: ${mongoUri}`);
  } catch (memError) {
    console.error('[DB Error] Failed to start In-Memory MongoDB:', memError.message);
  }
};

export default connectDB;
