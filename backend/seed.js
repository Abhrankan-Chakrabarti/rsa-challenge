import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Challenge from "./models/Challenge.js";

const MONGO_URI = "mongodb://localhost:27017/rsa_challenge";

// Resolve current directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Build absolute path to JSON file
    const filePath = path.resolve(__dirname, "../frontend/src/rsa_all_ciphertexts_hashed.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const challenges = JSON.parse(raw);

    // Clear existing challenges (optional)
    await Challenge.deleteMany({});
    console.log("🗑️ Cleared existing challenges");

    // Insert new ones
    await Challenge.insertMany(challenges);
    console.log(`🎉 Inserted ${challenges.length} challenges`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

run();
