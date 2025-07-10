// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // 1. Get and validate URI
    let uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is missing in .env');

    // 2. Force clean the URI (absolute guarantee)
    uri = uri
      .replace(/\s/g, '') // Remove all whitespace
      .replace(/:(\d+)\//, '/') // Remove port numbers
      .replace(/(mongodb\+srv:\/\/[^/]+)\/?/, '$1/'); // Ensure proper format

    // 3. Modern connection options
    const options = {
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
    };

    // 4. Connect with debug logging
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri, options);
    console.log('✅ MongoDB connected successfully');

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    // Special handling for URI errors
    if (error.message.includes('port number')) {
      console.error('\n🔧 SOLUTION:');
      console.error('Your connection string:', process.env.MONGODB_URI);
      console.error('1. Remove ALL port numbers (like :27017)');
      console.error('2. SRV format must be: mongodb+srv://user:pass@host/db');
      console.error('3. Check for hidden whitespace or special characters');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;
