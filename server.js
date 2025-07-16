require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'exp://your-expo-app-url',
    'https://your-react-native-app.com'
  ],
  credentials: true
}));

// Rate limiting (100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Logging
app.use(morgan('dev'));

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Database Connection
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grab';
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// API Documentation Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Grab Backend API',
    documentation: {
      endpoints: {
        restaurants: {
          getAll: 'GET /api/restaurants',
          getOne: 'GET /api/restaurants/:id',
          create: 'POST /api/restaurants (protected)',
          update: 'PATCH /api/restaurants/:id (protected)',
          delete: 'DELETE /api/restaurants/:id (protected)'
        },
        users: {
          register: 'POST /api/users/register',
          login: 'POST /api/users/login',
          profile: 'GET /api/users/me (protected)'
        },
        orders: {
          create: 'POST /api/orders (protected)',
          history: 'GET /api/orders/history (protected)'
        }
      },
      authentication: 'Use Authorization: Bearer <token> for protected routes'
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  });
});

// Server Setup
const PORT = process.env.PORT || 10000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', err => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => process.exit(1));
});

module.exports = server;
