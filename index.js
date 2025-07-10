require("dotenv").config(); // Load .env first

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./mongoose");

const auth = require("./src/middleware/auth");
const userRouter = require("./src/routes/userRouter");
const menuRouter = require("./src/routes/menuRouter");
const orderRouter = require("./src/routes/orderRouter");
const cartRouter = require("./src/routes/cartRouter");
const ratingRouter = require("./src/routes/ratingRouter");

const app = express();
app.use(express.json());
app.use(cors());

// HTTP + Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  },
});

// Attach io to requests
const withIO = (router) => [
  auth,
  (req, res, next) => {
    req.io = io;
    next();
  },
  router,
];

// Routes
app.use("/user", userRouter);
app.use("/menu", ...withIO(menuRouter));
app.use("/order", ...withIO(orderRouter));
app.use("/cart", ...withIO(cartRouter));
app.use("/rating", ...withIO(ratingRouter));

// Port + MongoDB URI from .env
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Start server
server.listen(PORT, async () => {
  try {
    await connectDB(MONGO_URI);
    console.log(`✅ Server is running at http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
});
