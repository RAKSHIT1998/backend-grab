// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db'); // Verify path is correct

const app = express();
const port = process.env.PORT || 8080;

// Start server after DB connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Fatal startup error:', err);
    process.exit(1);
  }
};

startServer();
