const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri || process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

module.exports = connectDB;
