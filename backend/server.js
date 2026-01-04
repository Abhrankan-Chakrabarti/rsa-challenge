import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import leaderboardRoutes from "./routes/leaderboard.js";
import submitRoutes from "./routes/submit.js";
import challengeRoutes from "./routes/challenges.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/rsa_challenge");

app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/submit", submitRoutes);
app.use("/api/challenges", challengeRoutes);

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
