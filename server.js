// server.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import listEndpoints from 'express-list-endpoints';
import { initSocketServer } from './src/socket/socket.js';
import connectDB from './src/configs/mongoose.js';
import errorHandler from './src/middleware/errorMiddleware.js';
import crypto from 'crypto';
import { startRefundScheduler } from './src/jobs/refundScheduler.js';

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
app.use(helmet());
app.use(compression());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));
app.use('/uploads', express.static('uploads'));
// Serve static frontend
app.use('/app', express.static('frontend'));

// In-memory store for simple Postman integration tests
const integrationTokens = new Map();

// POST /register - register a name and return a token
app.post('/register', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const token = crypto.randomBytes(16).toString('hex');
  integrationTokens.set(token, name);
  res.json({ token });
});

// GET /my-name - return the name associated with a token
app.get('/my-name', (req, res) => {
  const { token } = req.query;
  if (!token || !integrationTokens.has(token)) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  res.json({ name: integrationTokens.get(token) });
});

// POST /unregister - remove the token
app.post('/unregister', (req, res) => {
  const { token } = req.body;
  if (!token || !integrationTokens.has(token)) {
    return res.status(400).json({ error: 'Invalid token' });
  }
  integrationTokens.delete(token);
  res.sendStatus(200);
});

// Connect to MongoDB
const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb://localhost:27017/grab';
connectDB(MONGO_URI);

// Import all routers
import userRouter from './src/routes/userRoutes.js';
import driverRouter from './src/routes/driverRoutes.js';
import restaurantRouter from './src/routes/restaurantRoutes.cjs';
import martRouter from './src/routes/martRoutes.cjs';
import porterRouter from './src/routes/porterRoutes.cjs';
import medicineRouter from './src/routes/medicineRoutes.cjs';
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
import destinationRouter from './src/routes/destinationRoutes.js';
import menuRouter from './src/routes/menuRoutes.js';
import orderRouter from './src/routes/orderRoutes.js';
import cartRouter from './src/routes/cartRoutes.js';
import reviewsRouter from './src/routes/reviewsRoutes.js';
import ridesRouter from './src/routes/ridesRoutes.js';
import paymentsRouter from './src/routes/payments.js';
import ordersRouter from './src/routes/orders.js';
import authRouter from './src/routes/authRoutes.js';
import adminPortalRouter from './src/routes/admin.js';
import historyRouter from './src/routes/historyRoutes.js';
import supportRouter from './src/routes/supportRoutes.js';
import refundRouter from './src/routes/refundRoutes.js';
import bidRouter from './src/routes/bidRoutes.js';
import bikerAppRouter from './src/routes/bikerAppRoutes.js';
import partnerAppRouter from './src/routes/partnerAppRoutes.js';

// Mount API routes
app.use('/api/users', userRouter);
app.use('/api/drivers', driverRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/mart', martRouter);
app.use('/api/porter', porterRouter);
app.use('/api/medicine', medicineRouter);
app.use('/api/bike', bikeRouter);
app.use('/api/biker', bikerAppRouter);
app.use('/api/partner', partnerAppRouter);
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
app.use('/api/destinations', destinationRouter);
app.use('/api/menu', menuRouter);
app.use('/api/orders', orderRouter);
app.use('/api/cart', cartRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/rides', ridesRouter);
app.use('/api/payments-alt', paymentsRouter);
app.use('/api/orders-alt', ordersRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin-portal', adminPortalRouter);
app.use('/api/history', historyRouter);
app.use('/api/support', supportRouter);
app.use('/api/refunds', refundRouter);
app.use('/api/bids', bidRouter);

// Endpoint to list all available API routes
app.get('/api', (req, res) => {
  res.json(listEndpoints(app));
});

// Root health check route
app.get('/', (req, res) => {
  res.send(
    '🚀 Grab SuperApp API is running. Visit /api for a list of available endpoints.'
  );
});

// Global error handler
app.use(errorHandler);

// Start scheduled refund processing
startRefundScheduler();

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
