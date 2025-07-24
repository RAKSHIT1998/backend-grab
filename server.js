// server.js
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { configureSocket } from './socket.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Import all routers
import userRoutes from './routes/userRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import martRoutes from './routes/martRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import taxiRoutes from './routes/taxiRoutes.js';
import bikeRoutes from './routes/bikeRoutes.js';
import porterRoutes from './routes/porterRoutes.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Socket configuration
configureSocket(io);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/mart', martRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/taxi', taxiRoutes);
app.use('/api/bike', bikeRoutes);
app.use('/api/porter', porterRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
