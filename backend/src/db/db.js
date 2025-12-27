import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DATABASE_NAME}`
    );
    console.log(`✅ DB connected successfully! Host: ${connectionInstance.connection.host}`);
    return true; // <-- critical: ensures .then() in index.js triggers
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error; // <-- allows catch block in index.js to handle
  }
};

export {dbConnect}