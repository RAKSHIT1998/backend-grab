const express = require('express');
const connectDB = require('./config/mongoose');

const app = express();
const port = process.env.PORT || 8080;

// Initialize server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
