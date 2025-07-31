import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

// Use env var in production
const key = process.env.JWT_SECRET || '#479@/^5149*@123';

let io;

const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Auth middleware (JWT-based)
  const authMiddleware = async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Auth token required"));
      const decoded = jwt.verify(token, key);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  };

  // USER namespace
  const userNamespace = io.of("/user");
  userNamespace.use(authMiddleware);
  userNamespace.on("connection", (socket) => {
    console.log("User connected:", socket.user.id);

    socket.on("send-notification", (data) => {
      userNamespace.emit("receive-notification", data);
    });

    socket.on("user-location", (location) => {
      io.of("/driver").emit("update-user-location", {
        userId: socket.user.id,
        location,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.id);
    });
  });

  // DRIVER namespace
  const driverNamespace = io.of("/driver");
  driverNamespace.use(authMiddleware);
  driverNamespace.on("connection", (socket) => {
    console.log("Driver connected:", socket.user.id);

    socket.on("driver-location", (location) => {
      userNamespace.emit("update-driver-location", {
        driverId: socket.user.id,
        location,
      });
    });

    socket.on("bike-location", (location) => {
      userNamespace.emit("update-bike-location", {
        driverId: socket.user.id,
        location,
      });
    });

    socket.on("disconnect", () => {
      console.log("Driver disconnected:", socket.user.id);
    });
  });

  // BIKER namespace
  const bikerNamespace = io.of("/biker");
  bikerNamespace.use(authMiddleware);
  bikerNamespace.on("connection", (socket) => {
    console.log("Biker connected:", socket.user.id);

    socket.on("biker:updateLocation", (location) => {
      bikerNamespace.emit("biker:updateLocation", {
        bikerId: socket.user.id,
        location,
      });
    });

    socket.on("biker:orderStatusUpdate", (update) => {
      bikerNamespace.emit("biker:orderStatusUpdate", {
        bikerId: socket.user.id,
        ...update,
      });
    });

    socket.on("disconnect", () => {
      console.log("Biker disconnected:", socket.user.id);
    });
  });

  // RESTAURANT namespace
  const restaurantNamespace = io.of("/restaurant");
  restaurantNamespace.use(authMiddleware);
  restaurantNamespace.on("connection", (socket) => {
    console.log("Restaurant connected:", socket.user.id);

    socket.on("order-status", (update) => {
      userNamespace.emit("order-update", update);
    });

    socket.on("disconnect", () => {
      console.log("Restaurant disconnected:", socket.user.id);
    });
  });

  // PARTNER namespace
  const partnerNamespace = io.of("/partner");
  partnerNamespace.use(authMiddleware);
  partnerNamespace.on("connection", (socket) => {
    console.log("Partner connected:", socket.user.id);

    socket.on("partner:assignRider", (data) => {
      partnerNamespace.emit("partner:assignRider", {
        partnerId: socket.user.id,
        ...data,
      });
    });

    socket.on("partner:orderStatusUpdate", (update) => {
      partnerNamespace.emit("partner:orderStatusUpdate", {
        partnerId: socket.user.id,
        ...update,
      });
    });

    socket.on("disconnect", () => {
      console.log("Partner disconnected:", socket.user.id);
    });
  });

  return io;
};

const getIO = () => io;
export { initSocketServer, getIO };
