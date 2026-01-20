const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Set connection options
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 10s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('Please check:');
    console.error('1. MongoDB is running (or MongoDB Atlas connection string is correct)');
    console.error('2. MONGO_URI in .env file is correct');
    console.error('3. Network connection is stable');
    process.exit(1);
  }
};

module.exports = connectDB;
