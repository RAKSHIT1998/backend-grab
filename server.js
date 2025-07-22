const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

// MongoDB
const mongoose = require('mongoose');
const connectDB = require('./src/configs/mongoose');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
});

// Attach io to req for all routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Import Routes
const userRoutes = require('./src/routes/userRoutes');
const driverRoutes = require('./src/routes/driverRoutes');
const restaurantRoutes = require('./src/routes/restaurantRoutes');
const martRoutes = require('./src/routes/martRoutes');
const porterRoutes = require('./src/routes/porterRoutes');
const bikeRoutes = require('./src/routes/bikeRoutes');
const taxiRoutes = require('./src/routes/taxiRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

// Use Routes
app.use('/api/user', userRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/mart', martRoutes);
app.use('/api/porter', porterRoutes);
app.use('/api/bike', bikeRoutes);
app.use('/api/taxi', taxiRoutes);
app.use('/api/admin', adminRoutes);

// MongoDB connection string
const mongoURI = 'mongodb+srv://rakshit98:AdminRakshit@cluster0.n1m4mu0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const PORT = process.env.PORT || 3000;

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('⚡ Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('🚫 Socket disconnected:', socket.id);
  });

  // Example events
  socket.on('new-order', (data) => {
    console.log('📦 New Order:', data);
    io.emit('order-update', data); // broadcast to all clients
  });

  socket.on('driver-location', (location) => {
    io.emit('update-location', location);
  });

  socket.on('status-change', (status) => {
    io.emit('status-update', status);
  });
});

// Start server and DB
server.listen(PORT, async () => {
  try {
    await connectDB(mongoURI);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
});
