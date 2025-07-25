import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI
      .replace(/\s/g, '') // Remove whitespace
      .replace(/:(\d+)/, ''); // Remove ports
    
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('Verify your credentials in MongoDB Atlas → Database Access');
    process.exit(1);
  }
};

export default connectDB;
