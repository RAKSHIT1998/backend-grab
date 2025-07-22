const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const driverRouter = require("./routes/driverRoutes");
const restaurantRouter = require("./routes/restaurantRoutes");
const martRouter = require("./routes/martRoutes");
const porterRouter = require("./routes/porterRoutes");
const bikeRouter = require("./routes/bikeRoutes");
const taxiRouter = require("./routes/taxiRoutes");
const adminRouter = require("./routes/adminRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const walletRouter = require("./routes/walletRoutes");
const partnerRouter = require("./routes/partnerRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect("your_mongodb_uri_here", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/users", userRouter);
app.use("/api/drivers", driverRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/mart", martRouter);
app.use("/api/porter", porterRouter);
app.use("/api/bike", bikeRouter);
app.use("/api/taxi", taxiRouter);
app.use("/api/admin", adminRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/partner", partnerRouter);

// Health Check
app.get("/", (req, res) => {
  res.send("🚀 Grap SuperApp Backend is running");
});

app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
});
