const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");

require("dotenv").config();

const app = express();

// ==========================
// MIDDLEWARE
// ==========================
app.use(cors());
app.use(express.json());

// ==========================
// RATE LIMITER
// ==========================
const complaintLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 HOURS
  max: 8,
  message: {
    success: false,
    message: "Maximum 8 complaints allowed per day"
  },
  standardHeaders: true,
  legacyHeaders: false
});

// ==========================
// MONGODB CONNECTION
// ==========================
mongoose.connect("mongodb://jocoy62429_db_user:Anu12345@ac-d7nv5eq-shard-00-00.zevxl5a.mongodb.net:27017,ac-d7nv5eq-shard-00-01.zevxl5a.mongodb.net:27017,ac-d7nv5eq-shard-00-02.zevxl5a.mongodb.net:27017/issuesDB?ssl=true&replicaSet=atlas-oyua4q-shard-0&authSource=admin&retryWrites=true&w=majority")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

// ==========================
// ROUTES
// ==========================
const issueRoutes = require("./routes/issues");

app.use("/api/issues", complaintLimiter, issueRoutes);

// ==========================
// STATIC UPLOADS
// ==========================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================
// SERVER
// ==========================
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});