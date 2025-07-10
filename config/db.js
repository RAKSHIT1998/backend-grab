// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // 1. Get and validate the connection string
    let uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is missing in .env');

    // 2. Force clean the URI (critical fix for your error)
    if (uri.includes('+srv')) {
      uri = uri
        .replace(/:(\d+)/, '') // Remove port numbers
        .replace(/(\.mongodb\.net)(\?|$)/, '$1/$2'); // Ensure proper format
    }

    // 3. Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority'
    };

    // 4. Connect with debug logging
    console.log('Connecting to MongoDB with URI:', uri.replace(/\/\/[^:]+:[^@]+@/, '//username:****@'));
    await mongoose.connect(uri, options);
    console.log('✅ MongoDB connected successfully');

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

// Connection event handlers
mongoose.connection.on('error', err => {
  console.error('MongoDB runtime error:', err);
});

module.exports = connectDB;