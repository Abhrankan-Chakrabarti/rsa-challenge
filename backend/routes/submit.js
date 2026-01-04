import express from "express";
import Solve from "../models/Solve.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { challenge, sha256, name } = req.body;
  if (!challenge || !sha256 || !name) {
    return res.status(400).json({ ok: false, error: "Missing fields" });
  }

  try {
    // Check if this solve already exists
    const existing = await Solve.findOne({ nickname: name, challenge, sha256 });
    if (existing) {
      return res.status(409).json({ ok: false, error: "Duplicate submission" });
    }

    await Solve.create({ nickname: name, challenge, sha256 });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: "DB insert failed" });
  }
});

export default router;
