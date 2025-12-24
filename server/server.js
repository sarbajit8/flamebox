const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
require("dotenv").config();

const app = express();

// ============================================
// MIDDLEWARE
// ============================================
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Session middleware with MongoDB store for persistence
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/Flamebox";

app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "flamebox-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      touchAfter: 24 * 3600, // Lazy session update (24 hours)
    }),
    cookie: {
      httpOnly: true,
      secure: false, // Must be false for http://localhost
      sameSite: "lax", // 'lax' works for localhost same-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    name: "connect.sid", // Explicitly set session cookie name
  })
);
console.log("✅ Session middleware configured with MongoDB store");
console.log(
  "🍪 Cookie settings: { secure: false, sameSite: 'lax', httpOnly: true }"
);

// ✅ ENABLE Logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  console.log(`🍪 Cookies received:`, req.cookies);
  console.log(`🆔 Session ID:`, req.sessionID);
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    console.log("📦 Body:", JSON.stringify(req.body, null, 2));
  }
  next();
});

// ============================================
// ROUTES
// ============================================
const packagesRoutes = require("./routes/admin/packages-routes");
const packageFeaturesRoutes = require("./routes/admin/packagefeatures-routes");
const employeeRoutes = require("./routes/admin/employee-routes");
const membersRoutes = require("./routes/admin/members-routes");
const leadsRoutes = require("./routes/admin/leads-routes");
const dashboardRoutes = require("./routes/admin/dashboard-routes");
const scheduleRoutes = require("./routes/admin/schedule-routes");
const paymentHistoryRoutes = require("./routes/admin/paymenthistory-routes");

// New role-based authentication routes
const usersRoutes = require("./routes/auth/users-routes");
const trainerRoutes = require("./routes/auth/trainer-routes");

app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/admin/members", membersRoutes); // Also mount at /api/admin/members
app.use("/api/leads", leadsRoutes);
app.use("/api/packages", packagesRoutes);
app.use("/api/package", packageFeaturesRoutes);
app.use("/api", employeeRoutes);
app.use("/api/admin/schedule", scheduleRoutes);
app.use("/api/admin/payment-history", paymentHistoryRoutes);

// Role-based authentication routes
app.use("/api/auth/users", usersRoutes);
app.use("/api/auth/trainer", trainerRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Server is working!" });
});

// ============================================
// ✅ ENABLE ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  console.error("❌ Stack:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    console.log("📊 Database:", mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log("📍 Available routes:");
      console.log("   POST   /api/leads/create");
      console.log("   GET    /api/leads");
      console.log("   GET    /api/leads/:id");
      console.log("   PUT    /api/leads/:id");
      console.log("   DELETE /api/leads/:id");
      console.log("   PATCH  /api/leads/:id/status");
      console.log("   POST   /api/leads/:id/follow-up");
      console.log("   GET    /api/leads/analytics/statistics");
      console.log("   GET/PUT/POST /api/admin/schedule");

      // Start event reminder cron job
      const { startEventReminderCron } = require("./cron/eventReminders");
      startEventReminderCron();

      // Start package expiry reminder cron job
      const {
        initPackageExpiryCron,
      } = require("./cron/packageExpiryReminders");
      initPackageExpiryCron();
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});

module.exports = app;
