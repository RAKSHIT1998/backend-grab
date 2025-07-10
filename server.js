const express = require('express');
const connectDB = require('./config/db'); // Updated path

const app = express();
const port = process.env.PORT || 8080;

// Initialize server
const startServer = async () => {
  try {
    await connectDB(); // This will now use the sanitized connection
    
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Fatal startup error:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
