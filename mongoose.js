require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('./logger'); // Optional: if you have a logger utility

const connectDB = async () => {
  try {
    // Validate the connection string format
    const connectionUri = process.env.MONGODB_URI;
    if (!connectionUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    if (connectionUri.includes('mongodb+srv') && connectionUri.match(/:\d+/)) {
      throw new Error('mongodb+srv URI cannot have port number');
    }

    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    };

    // Establish connection
    await mongoose.connect(connectionUri, options);
    console.log('✅ MongoDB connected successfully');
    
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from DB');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Connection URI:', process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//username:****@') : 
      'Not configured');
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;
