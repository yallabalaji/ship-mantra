import mongoose from "mongoose";

const connectDB = async () => {
  // Log to check if the environment variable is set correctly
  console.log("Attempting to connect to MongoDB...");

  if (!process.env.DB_URI) {
    console.error("Error: MongoDB URI is not defined in the environment variables.");
    throw new Error("MongoDB URI is not defined in the environment variables.");
  }

  try {
    // Log the connection attempt
    console.log("Connecting to MongoDB...");

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`); // Log successful connection

  } catch (error: unknown) {
    // Enhanced error logging
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      console.error("Stack trace:", error.stack); // This will help debug
    } else {
      console.error("An unknown error occurred");
    }

    // Exiting the process with a non-zero status to indicate failure
    process.exit(1);
  }
};

export default connectDB;
