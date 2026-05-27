require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const { swaggerUi, swaggerSpec } = require("./swagger");
const errorHandler = require("./middleware/errorHandler");
const pool = require("./db"); // pool object, not a function
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Global Middleware
app.use(cors({
  origin: '*'
}));

// app.use(express.json({ limit: "10mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Dynamic Router Loader
const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith("Routes.js")) {
    const route = require(path.join(routesPath, file));
    app.use("/api", route);
  }
});

// Swagger Docs
app.use("/pjsv", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error Handling Middleware (must be last)
app.use(errorHandler);

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
