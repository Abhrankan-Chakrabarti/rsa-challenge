import express from "express";
import Solve from "../models/Solve.js";

const router = express.Router();

router.post("/", async (req, res) => {
  let { challenge, sha256, name } = req.body;

  // -------------------------------
  // Normalize inputs (CRITICAL)
  // -------------------------------
  challenge = challenge?.trim();
  sha256 = sha256?.trim();
  name = name?.trim();

  if (!challenge || !sha256 || !name) {
    return res.status(400).json({
      ok: false,
      error: "Missing or invalid fields"
    });
  }

  try {
    // Prevent duplicate solves
    const existing = await Solve.findOne({
      nickname: name,
      challenge,
      sha256
    });

    if (existing) {
      return res.status(409).json({
        ok: false,
        error: "Duplicate submission"
      });
    }

    await Solve.create({
      nickname: name,
      challenge,
      sha256
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Solve insert failed:", err);
    res.status(500).json({
      ok: false,
      error: "DB insert failed"
    });
  }
});

export default router;
