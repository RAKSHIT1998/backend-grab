// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Get and validate the URI
    let uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Force remove any port numbers if using +srv
    if (uri.includes('mongodb+srv://')) {
      uri = uri.replace(/:(\d+)/, ''); // Remove any port numbers
      uri = uri.replace(/(mongodb\+srv:\/\/[^/]+)\/?/, '$1/'); // Ensure proper formatting
    }

    // Debug: Log the sanitized URI (without password)
    console.log('Connecting with URI:', uri.replace(/\/\/[^:]+:[^@]+@/, '//username:****@'));

    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority'
    };

    // Connect to MongoDB
    await mongoose.connect(uri, options);
    console.log('✅ MongoDB connected successfully');

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Full error stack:', error.stack);
    process.exit(1);
  }
};

module.exports = connectDB;
