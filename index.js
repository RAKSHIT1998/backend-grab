require('dotenv').config(); // Add this at the very top
const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_ORIGIN || "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  },
});
const connectDB = require("./src/configs/mongoose");
const auth = require("./src/middleware/auth");
const userRouter = require("./src/routes/userRouter");
const menuRouter = require("./src/routes/menuRouter");
const orderRouter = require("./src/routes/orderRouter");
const cartRouter = require("./src/routes/cartRouter");
const ratingRouter = require("./src/routes/ratingRouter");

const port = process.env.PORT || 3000;

// Routes
app.use("/user", userRouter);
app.use(
  "/menu",
  auth,
  (req, res, next) => {
    req.io = io;
    next();
  },
  menuRouter
);
app.use(
  "/order", 
  auth, 
  (req, res, next) => {
    req.io = io;
    next();
  }, 
  orderRouter
);
app.use(
  "/cart",
  auth,
  (req, res, next) => {
    req.io = io;
    next();
  },
  cartRouter
);
app.use(
  "/rating",
  auth,
  (req, res, next) => {
    req.io = io;
    next();
  },
  ratingRouter
);

// Server startup
server.listen(port, async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Server startup error:", err);
    process.exit(1);
  }
});

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
