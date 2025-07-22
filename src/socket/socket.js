const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const key = "#479@/^5149*@123"; // Use from env in production

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

    socket.on("disconnect", () => {
      console.log("Driver disconnected:", socket.user.id);
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

  return io;
};

module.exports = { initSocketServer };
