// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // 1. Get and validate the connection string
    let uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is missing in .env');

    // 2. Clean the URI (critical fix)
    if (uri.includes('+srv')) {
      uri = uri
        .replace(/:(\d+)/, '') // Remove port numbers
        .replace(/(\.mongodb\.net)(\?|$)/, '$1/$2'); // Ensure proper format
    }

    // 3. Modern connection options (no deprecated settings)
    const options = {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    };

    // 4. Connect with debug logging
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri, options);
    console.log('✅ MongoDB connected successfully');

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    // Specific handling for authentication errors
    if (error.message.includes('authentication failed')) {
      console.error('\n🔐 AUTHENTICATION FAILURE:');
      console.error('1. Verify your username/password in the connection string');
      console.error('2. Check MongoDB Atlas → Security → Database Access');
      console.error('3. Ensure your IP is whitelisted in Network Access');
    }
    
    process.exit(1);
  }
};

// Connection event handlers
mongoose.connection.on('error', err => {
  console.error('MongoDB runtime error:', err);
});

module.exports = connectDB;