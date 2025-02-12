import express from "express";
import cors from "cors";
import connectDB from "./config/dbConfig";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import authRouter from "./routers/authRouter";
import hubRouter from "./routers/hubRouter";
import routeRouter from "./routers/routeRouter";
import graphRouter from "./routers/graphRouter";

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
// const swaggerOptions = {
//   swaggerDefinition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Ship Mantra API",
//       description: "API documentation for Ship Mantra",
//       version: "1.0.0",
//     },
//   },
//   apis: ["./src/routers/*.ts"], // Path to the route files for auto-generation
// };

// const swaggerDocs = swaggerJSDoc(swaggerOptions);


// Swagger JSDoc setup with JWT Authentication
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Ship Mantra API",
      description: "API documentation for Ship Mantra",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Optional
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/routers/*.ts"], // Path to the route files for auto-generation
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// swagger ui setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs,{
  explorer: true, // This is essential for the "Authorize" button
}));
// auth end points routes
app.use("/auth", authRouter);
// Mount the hubRouter
app.use("/hub", hubRouter);
// Mount the routeRouter
app.use("/routes", routeRouter);
// Mount the graph update endpoint
app.use("/graph", graphRouter);


// MongoDB connection using environment variable for URI
connectDB();
