const mongoose = require("mongoose");

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    console.warn("No MONGO_URI provided. Skipping MongoDB connection.");
    return null;
  }

  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB connected");
    return mongoose.connection;

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
}

module.exports = { connectDB };
