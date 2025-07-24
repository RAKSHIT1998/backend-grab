// server.js
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import connectDB from './src/config/db.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ROUTES
import userRouter from './src/routes/userRoutes.js';
import driverRouter from './src/routes/driverRoutes.js';
import restaurantRouter from './src/routes/restaurantRoutes.js';
import martRouter from './src/routes/martRoutes.js';
import porterRouter from './src/routes/porterRoutes.js';
import bikeRouter from './src/routes/bikeRoutes.js';
import taxiRouter from './src/routes/taxiRoutes.js';
import adminTaxiRoutes from './src/routes/adminTaxiRoutes.js';
import walletRouter from './src/routes/walletRoutes.js';
import paymentRouter from './src/routes/paymentRoutes.js';
import adminRouter from './src/routes/adminRoutes.js';
import fareRouter from './src/routes/fareRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
// Use Routes
app.use('/api/users', userRouter);
app.use('/api/drivers', driverRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/mart', martRouter);
app.use('/api/porter', porterRouter);
app.use('/api/bike', bikeRouter);
app.use('/api/taxi', taxiRouter);
app.use('/api/admin/taxi', adminTaxiRoutes);
app.use('/api/wallet', walletRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/admin', adminRouter);
app.use('/api/fare', fareRouter);
app.use('/api/notifications', notificationRoutes)
// Root health check
app.get('/', (req, res) => {
  res.send('🚀 Grap SuperApp API is running');
});

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
