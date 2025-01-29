import express from "express";
import cors from "cors";
import connectDB from "./config/dbConfig";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import authRouter from "./routers/authRouter";

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

// swagger confuguration

// Swagger JSDoc setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Ship Mantra API",
      description: "API documentation for Ship Mantra",
      version: "1.0.0",
    },
  },
  apis: ["./src/routers/*.ts"], // Path to the route files for auto-generation
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// auth end points routes
app.use("/auth", authRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// MongoDB connection using environment variable for URI
connectDB();
