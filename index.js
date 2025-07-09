
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
const port = process.env.PORT;
const url =
  "mongodb+srv://rakshitbargotra@gmail.com:Rakshit@9858@cluster0.abcd.mongodb.net/<dbname>?retryWrites=true&w=majority";
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
app.use("/order", auth, (req, res, next) => {
    req.io = io;
    next();
  }, orderRouter);
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
server.listen(port, async () => {
  try {
    await connectDB(url);
    console.log(`server is running on http://localhost:${port}`);
  } catch (err) {
    console.log(err);
  }
});
