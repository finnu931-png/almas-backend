// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/database");

// Connect to database
connectDB();

const app = express();

// ✅ CORS middleware - allow all origins, support credentials
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      // Echo back the requesting origin (dynamic)
      return callback(null, origin);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // ✅ allow cookies / Authorization headers
  })
);

// Explicitly handle preflight
app.options("*", cors());

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
