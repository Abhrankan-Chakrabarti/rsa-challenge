import express from "express";
import crypto from "crypto";
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

// -----------------------------------------------
// Canonical plaintext normalization. Must stay in
// sync with GuessForm.tsx -- the client pre-checks
// with the same function before submitting.
// -----------------------------------------------
function normalizePlaintext(s) {
  return typeof s === "string" ? s.trim().replace(/\s+/g, " ").toUpperCase() : "";
}

router.post("/", submitLimiter, async (req, res) => {
  let { challenge, plaintext, name } = req.body;

  challenge = challenge?.trim();
  plaintext = normalizePlaintext(plaintext);
  name = name?.trim();

  if (!challenge || !plaintext || !name) {
    return res.status(400).json({
      ok: false,
      error: "Missing or invalid fields"
    });
  }

  // Plaintext alphabet: A-Z and spaces only (matches challenge data
  // generation). Rejects anything else before it reaches the hasher.
  if (!/^[A-Z ]+$/.test(plaintext)) {
    return res.status(400).json({
      ok: false,
      error: "Plaintext may only contain A-Z and spaces"
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
    // The client submits the PLAINTEXT, never the hash. The expected
    // hash is public (it ships with the challenge data), so a submitted
    // hash proves nothing. Proving you hold the plaintext IS the solve:
    // recovering it requires factoring the modulus.
    // -----------------------------------------------
    const hash = crypto.createHash("sha256").update(plaintext).digest("hex");

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
      sha256: hash
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
