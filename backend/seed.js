import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

import Challenge from "./models/Challenge.js";

// --------------------------------------------------
// Load environment variables
// --------------------------------------------------
dotenv.config();

// --------------------------------------------------
// Resolve MongoDB URI (same logic as backend)
// --------------------------------------------------
const MONGO_URI =
  process.env.MONGO_URI ||
  (process.env.NODE_ENV !== "production"
    ? "mongodb://127.0.0.1:27017/rsa_challenge"
    : null);

if (!MONGO_URI) {
  throw new Error("MONGO_URI must be set to run the seed script in production");
}

// --------------------------------------------------
// Resolve current directory
// --------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------------------------------
// Seed runner
// --------------------------------------------------
async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Build absolute path to JSON file
    const filePath = path.resolve(
      __dirname,
      "../frontend/src/rsa_all_ciphertexts_hashed.json"
    );

    const raw = fs.readFileSync(filePath, "utf-8");
    const challenges = JSON.parse(raw);

    // Clear existing challenges (intentional for seed)
    await Challenge.deleteMany({});
    console.log("🗑️ Cleared existing challenges");

    // Insert new challenges
    await Challenge.insertMany(challenges);
    console.log(`🎉 Inserted ${challenges.length} challenges`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

run();
