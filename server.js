require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db'); // Ensure this path is correct

const app = express();
const port = process.env.PORT || 8080;

// Initialize server
const startServer = async () => {
  try {
    await connectDB(); // Connect to database first
    
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Fatal startup error:', error);
    process.exit(1);
  }
};

// Start the application
startServer();