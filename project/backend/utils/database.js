import mongoose from 'mongoose';

// Database connection with retry logic
export const connectDatabase = async (retries = 5) => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-interview-agent';
    
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    console.log('✅ Connected to MongoDB');
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

  } catch (error) {
    console.error(`❌ MongoDB connection failed (${retries} retries left):`, error.message);
    if (retries > 0) {
      console.log(`🔄 Retrying connection in 5 seconds...`);
      setTimeout(() => connectDatabase(retries - 1), 5000);
    } else {
      console.error('❌ Failed to connect to MongoDB after multiple attempts. Continuing without DB for dev.');
    }
  }
};

// Graceful shutdown
export const gracefulShutdown = () => {
  mongoose.connection.close(() => {
    console.log('📴 MongoDB connection closed through app termination');
    process.exit(0);
  });
};

// Database health check
export const checkDatabaseHealth = async () => {
  try {
    await mongoose.connection.db.admin().ping();
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
  }
};