const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// MongoDB Connection
mongoose
  .connect("mongodb+srv://rakshit98:AdminRakshit@cluster0.n1m4mu0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Importing routes
const userRoutes = require("./src/routes/userRoutes");
const driverRoutes = require("./src/routes/driverRoutes");
const restaurantRoutes = require("./src/routes/restaurantRoutes");
const martRoutes = require("./src/routes/martRoutes");
const porterRoutes = require("./src/routes/porterRoutes");
const bikeRoutes = require("./src/routes/bikeRoutes");
const taxiRoutes = require("./src/routes/taxiRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const walletRoutes = require("./src/routes/walletRoutes");
const partnerRoutes = require("./src/routes/partnerRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");

// API Endpoints
app.use("/api/users", userRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/marts", martRoutes);
app.use("/api/porters", porterRoutes);
app.use("/api/bikes", bikeRoutes);
app.use("/api/taxis", taxiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/payments", paymentRoutes);

// Root health check
app.get("/", (req, res) => {
  res.send("🚀 Grap SuperApp backend is running successfully.");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is live on port ${PORT}`);
});
