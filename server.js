// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/database");

// Connect to database
connectDB();

const app = express();

// Allowed origins
const allowedOrigins = [
  "https://almaspay.io",
  "https://www.almaspay.io",
  "http://localhost:5173"
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // In dev mode allow everything
        if (process.env.NODE_ENV !== "production") {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
    credentials: true, // if you use cookies/auth headers
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", require("./routes/index"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/work", require("./routes/caseStudyRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/seed", require("./routes/seedRoutes"));
app.use("/api/homepage-sections", require("./routes/homepageSectionRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

module.exports = app;
