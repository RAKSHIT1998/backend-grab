// backend-grab/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: "*" },
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect("mongodb+srv://rakshit98:AdminRakshit@cluster0.n1m4mu0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// Socket.IO Logic
io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);
  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

app.set("io", io); // Make io accessible in routes

// Routes
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/drivers", require("./src/routes/driverRoutes"));
app.use("/api/restaurants", require("./src/routes/restaurantRoutes"));
app.use("/api/marts", require("./src/routes/martRoutes"));
app.use("/api/porters", require("./src/routes/porterRoutes"));
app.use("/api/bikes", require("./src/routes/bikeRoutes"));
app.use("/api/taxis", require("./src/routes/taxiRoutes"));
app.use("/api/payments", require("./src/routes/paymentRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/admin/taxi", require("./src/routes/adminTaxiRoutes"));
app.use("/api/partners", require("./src/routes/partnerRoutes"));
app.use("/api/wallets", require("./src/routes/walletRoutes"));
app.use("/api/ratings", require("./src/routes/ratingRoutes"));
app.use("/api/cart", require("./src/routes/cartRoutes"));
app.use("/api/orders", require("./src/routes/orderRoutes"));
app.use("/api/menus", require("./src/routes/menuRoutes"));

// Health check
app.get("/", (req, res) => res.send("Grap SuperApp Backend Running"));

// Server listen
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
