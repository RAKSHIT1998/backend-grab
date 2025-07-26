// server.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { initSocketServer } from './src/socket/socket.js';
import connectDB from './src/configs/mongoose.js';
import errorHandler from './src/middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Initialize express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocketServer(server);

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://rakshit98:AdminRakshit@cluster0.n1m4mu0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
connectDB(MONGO_URI);

// Import all routers
import userRouter from './src/routes/userRoutes.js';
import driverRouter from './src/routes/driverRoutes.js';
import restaurantRouter from './src/routes/restaurantRoutes.cjs';
import martRouter from './src/routes/martRoutes.cjs';
import porterRouter from './src/routes/porterRoutes.cjs';
import bikeRouter from './src/routes/bikeRoutes.js';
import taxiRouter from './src/routes/taxiRoutes.cjs';
import adminTaxiRoutes from './src/routes/adminTaxiRoutes.js';
import walletRouter from './src/routes/walletRoutes.js';
import paymentRouter from './src/routes/paymentRoutes.js';
import adminRouter from './src/routes/adminRoutes.js';
import ratingRouter from './src/routes/ratingRoutes.cjs';
import fareRouter from './src/routes/fareRoutes.js';
import notificationRouter from './src/routes/notificationRoutes.js';
import movieRouter from './src/routes/movieRoutes.js';
import activityRouter from './src/routes/activityRoutes.js';
import newsRouter from './src/routes/newsRoutes.js';
import depositRouter from './src/routes/depositRoutes.js';
import settingRouter from './src/routes/settingRoutes.js';

// Mount API routes
app.use('/api/users', userRouter);
app.use('/api/drivers', driverRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/mart', martRouter);
app.use('/api/porter', porterRouter);
app.use('/api/bike', bikeRouter);
app.use('/api/taxi', taxiRouter);
app.use('/api/admin/taxi', adminTaxiRoutes);
app.use('/api/wallet', walletRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/admin', adminRouter);
app.use('/api/ratings', ratingRouter);
app.use('/api/fare', fareRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/movies', movieRouter);
app.use('/api/activities', activityRouter);
app.use('/api/news', newsRouter);
app.use('/api/deposits', depositRouter);
app.use('/api/settings', settingRouter);

// Root health check route
app.get('/', (req, res) => {
  res.send(
    '🚀 Grab SuperApp API is running. Available endpoints start with /api/'
  );
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
