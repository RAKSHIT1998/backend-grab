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
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  },
});

const connectDB = require("./mongoose");
const auth = require("./src/middleware/auth");

const userRouter = require("./src/routes/userRouter");
const menuRouter = require("./src/routes/menuRouter");
const orderRouter = require("./src/routes/orderRouter");
const cartRouter = require("./src/routes/cartRouter");
const ratingRouter = require("./src/routes/ratingRouter");

const PORT = process.env.PORT || ;

// ✅ Make sure this name matches below
const mongoURI =
  "mongodb+srv://rakshitbargotra@gmail.com:Rakshit@9858@cluster0.n1m4mu0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// ROUTES
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

// START SERVER
server.listen(PORT, async () => {
  try {
    await connectDB(mongoURI);
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
});
