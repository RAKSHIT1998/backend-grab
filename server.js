const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { initSocketServer } = require("./src/socket/socket");
const connectDB = require("./src/configs/mongoose");

// Load environment variables
dotenv.config();

// Initialize express and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocketServer(server);

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://rakshit98:AdminRakshit@cluster0.n1m4mu0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
connectDB(MONGO_URI);

// Import Routes
const userRouter = require("./src/routes/userRoutes");
const driverRouter = require("./src/routes/driverRoutes");
const restaurantRouter = require("./src/routes/restaurantRoutes");
const martRouter = require("./src/routes/martRoutes");
const porterRouter = require("./src/routes/porterRoutes");
const bikeRouter = require("./src/routes/bikeRoutes");
const taxiRouter = require("./src/routes/taxiRoutes");
const adminTaxiRoutes = require("./src/routes/adminTaxiRoutes");

// Route Bindings
app.use("/api/users", userRouter);
app.use("/api/drivers", driverRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/mart", martRouter);
app.use("/api/porter", porterRouter);
app.use("/api/bike", bikeRouter);
app.use("/api/taxi", taxiRouter);
app.use("/api/admin/taxi", adminTaxiRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
