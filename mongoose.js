const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Get URI from environment and validate it
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Remove any port numbers if using +srv
    const cleanUri = uri.includes('mongodb+srv://') 
      ? uri.replace(/(mongodb\+srv:\/\/[^/]+):\d+/, '$1')
      : uri;

    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    };

    // Connect to MongoDB
    await mongoose.connect(cleanUri, options);
    console.log('✅ MongoDB connected successfully');

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('Using connection string:', 
      process.env.MONGODB_URI 
        ? process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//username:****@')
        : 'Not configured'
    );
    process.exit(1);
  }
};

module.exports = connectDB;
