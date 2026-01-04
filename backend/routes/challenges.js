import express from "express";
import Challenge from "../models/Challenge.js";

const router = express.Router();

// Get all challenges
router.get("/", async (req, res) => {
  try {
    const challenges = await Challenge.find({});
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ error: "DB query failed" });
  }
});

// Seed challenges (optional, one‑time)
router.post("/seed", async (req, res) => {
  try {
    await Challenge.insertMany(req.body); // expects array of challenge objects
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Seed failed" });
  }
});

export default router;
