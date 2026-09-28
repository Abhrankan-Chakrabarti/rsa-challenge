import express from "express";
import rateLimit from "express-rate-limit";
import Solve from "../models/Solve.js";
import Challenge from "../models/Challenge.js";

const router = express.Router();

// -----------------------------------------------
// Per-IP rate limit: 5 submissions per 15 minutes.
// Memory store is fine for a single Render instance.
// -----------------------------------------------
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many submissions, try again later" }
});

router.post("/", submitLimiter, async (req, res) => {
  let { challenge, sha256, name } = req.body;

  // -------------------------------
  // Normalize inputs (CRITICAL)
  // -------------------------------
  challenge = challenge?.trim();
  sha256 = sha256?.trim().toLowerCase();
  name = name?.trim();

  if (!challenge || !sha256 || !name) {
    return res.status(400).json({
      ok: false,
      error: "Missing or invalid fields"
    });
  }

  // Nickname sanity: 1-32 chars, letters/digits/space/dot/dash/underscore.
  // Stops "a"-style junk and control characters from reaching the board.
  if (!/^[\w .-]{1,32}$/u.test(name)) {
    return res.status(400).json({
      ok: false,
      error: "Nickname must be 1-32 chars (letters, digits, space, . _ -)"
    });
  }

  try {
    // -----------------------------------------------
    // Verify the solve against the real challenge.
    // Without these two checks, ANY (challenge, sha256, name)
    // triple counts as a solve -- the leaderboard can be
    // inflated with a single curl command.
    // -----------------------------------------------
    const entry = await Challenge.findOne({ name: challenge });
    if (!entry) {
      return res.status(404).json({
        ok: false,
        error: "Unknown challenge"
      });
    }
    if (sha256 !== entry.sha256) {
      return res.status(400).json({
        ok: false,
        error: "Incorrect plaintext"
      });
    }

    // Prevent duplicate solves. The sha256 must equal the challenge's
    // canonical hash at this point, so nickname+challenge is the real
    // duplicate key.
    const existing = await Solve.findOne({
      nickname: name,
      challenge
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
    // Mongo's duplicate-key error (code 11000) surfaces if two
    // concurrent submissions race past the findOne above -- the
    // unique index in Solve.js is the real guard.
    if (err.code === 11000) {
      return res.status(409).json({
        ok: false,
        error: "Duplicate submission"
      });
    }
    console.error("Solve insert failed:", err);
    res.status(500).json({
      ok: false,
      error: "DB insert failed"
    });
  }
});

export default router;
