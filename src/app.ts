import express from "express";
import cors from "cors";
import connectDB from "./config/dbConfig";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
dotenv.config();

app.get("/", (req, res) => {
  res.send("Ship Mantra Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// MongoDB connection using environment variable for URI
connectDB();
