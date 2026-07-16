const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// Security Headers
app.use(helmet());

// CORS
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) {
        return callback(null, true);
      }
      
      // Check if origin is in the allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow Vercel preview/deployment URLs for this project
      // Matches https://my-job-portal.vercel.app and https://my-job-portal-*.vercel.app
      const vercelRegex = /^https:\/\/my-job-portal(?:-[a-zA-Z0-9-]+)?\.vercel\.app$/;
      if (vercelRegex.test(origin)) {
        return callback(null, true);
      }

      // If the origin is not allowed, reject it cleanly without throwing an Express error
      callback(null, false);
    },
    credentials: true,
  })
);


// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

app.use(limiter);

// Logging
app.use(morgan("dev"));

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Job Portal API is running",
  });
});

// Swagger API Documentation
const { specs, swaggerUi } = require("./config/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/api", require("./routes"));

// 404 Middleware
app.use(require("./middleware/notFound"));

// Global Error Handler
app.use(require("./middleware/errorHandler"));

module.exports = app;