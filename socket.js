// src/socket.js
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
const key = process.env.JWT_SECRET || '#479@/^5149*@123';

let io;

const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // JWT auth middleware
  const authMiddleware = async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Auth token required'));
      const decoded = jwt.verify(token, key);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Invalid token'));
    }
  };

  // USER namespace
  const userNamespace = io.of('/user');
  userNamespace.use(authMiddleware);
  userNamespace.on('connection', (socket) => {
    console.log('User connected:', socket.user.id);

    socket.on('send-notification', (data) => {
      userNamespace.emit('receive-notification', data);
    });

    socket.on('request-taxi', (rideRequest) => {
      io.of('/taxi').emit('new-taxi-request', {
        userId: socket.user.id,
        ...rideRequest,
      });
    });

    socket.on('accept-bid', (bidInfo) => {
      io.of('/taxi').emit('bid-accepted', {
        userId: socket.user.id,
        ...bidInfo,
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user.id);
    });
  });

  // DRIVER namespace
  const driverNamespace = io.of('/driver');
  driverNamespace.use(authMiddleware);
  driverNamespace.on('connection', (socket) => {
    console.log('Driver connected:', socket.user.id);

    socket.on('driver-location', (location) => {
      io.of('/user').emit('update-driver-location', {
        driverId: socket.user.id,
        location,
      });
    });

    socket.on('bike-location', (location) => {
      io.of('/user').emit('update-bike-location', {
        driverId: socket.user.id,
        location,
      });
    });

    socket.on('bid-on-request', (bidDetails) => {
      io.of('/user').emit('driver-bid', {
        driverId: socket.user.id,
        ...bidDetails,
      });
    });

    socket.on('disconnect', () => {
      console.log('Driver disconnected:', socket.user.id);
    });
  });

  // RESTAURANT namespace
  const restaurantNamespace = io.of('/restaurant');
  restaurantNamespace.use(authMiddleware);
  restaurantNamespace.on('connection', (socket) => {
    console.log('Restaurant connected:', socket.user.id);

    socket.on('order-status', (update) => {
      io.of('/user').emit('order-update', update);
    });

    socket.on('disconnect', () => {
      console.log('Restaurant disconnected:', socket.user.id);
    });
  });

  // TAXI namespace (for bidding)
  const taxiNamespace = io.of('/taxi');
  taxiNamespace.use(authMiddleware);
  taxiNamespace.on('connection', (socket) => {
    console.log('Taxi driver connected:', socket.user.id);

    socket.on('new-bid', (bid) => {
      io.of('/user').emit('receive-bid', {
        driverId: socket.user.id,
        ...bid,
      });
    });

    socket.on('update-bid', (bid) => {
      io.of('/user').emit('update-bid', {
        driverId: socket.user.id,
        ...bid,
      });
    });

    socket.on('disconnect', () => {
      console.log('Taxi driver disconnected:', socket.user.id);
    });
  });

  return io;
};

export { initSocketServer };
