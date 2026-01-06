import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import leaderboardRoutes from "./routes/leaderboard.js";
import submitRoutes from "./routes/submit.js";
import challengeRoutes from "./routes/challenges.js";

// --------------------------------------------------
// Load environment variables
// --------------------------------------------------
dotenv.config();

// --------------------------------------------------
// Resolve MongoDB URI (correct + explicit)
// --------------------------------------------------
const MONGO_URI =
  process.env.MONGO_URI ||
  (process.env.NODE_ENV !== "production"
    ? "mongodb://127.0.0.1:27017/rsa_challenge"
    : null);

if (!MONGO_URI) {
  throw new Error("MONGO_URI must be set in production");
}

// --------------------------------------------------
// App setup
// --------------------------------------------------
const app = express();

app.use(cors());
app.use(express.json());

// --------------------------------------------------
// Database connection
// --------------------------------------------------
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// --------------------------------------------------
// Routes
// --------------------------------------------------
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/submit", submitRoutes);
app.use("/api/challenges", challengeRoutes);

// --------------------------------------------------
// Health check
// --------------------------------------------------
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// --------------------------------------------------
// Start server
// --------------------------------------------------
const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
