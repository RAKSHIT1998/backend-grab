const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("❌ MONGO_URI not found in environment variables");
  }

  try {
    await mongoose.connect(uri, {
      // useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
};

module.exports = connectDB;
