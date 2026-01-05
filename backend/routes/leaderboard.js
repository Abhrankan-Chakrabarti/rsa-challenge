import express from "express";
import Solve from "../models/Solve.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    /* -------- Leaderboard -------- */
    const solves = await Solve.aggregate([
      {
        $group: {
          _id: "$nickname",
          solves: { $sum: 1 },
          last_solve: { $max: "$solved_at" }
        }
      },
      { $sort: { solves: -1, last_solve: 1 } } // DESC solves, ASC last_solve
    ]);

    let rank = 1;
    const leaderboard = solves.map(s => ({
      rank: rank++,
      nickname: s._id,
      solves: s.solves,
      last_solve: s.last_solve
    }));

    /* -------- Latest solve -------- */
    const latestDoc = await Solve.findOne().sort({ solved_at: -1 });
    const latest = latestDoc
      ? {
          nickname: latestDoc.nickname,
          challenge: latestDoc.challenge,
          solved_at: latestDoc.solved_at
        }
      : null;

    /* -------- Per-challenge counts -------- */
    const countsAgg = await Solve.aggregate([
      { $group: { _id: "$challenge", solves: { $sum: 1 } } }
    ]);
    const counts = Object.fromEntries(
      countsAgg.map(c => [c._id, c.solves])
    );

    /* -------- Response -------- */
    res.json({ leaderboard, latest, counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB query failed" });
  }
});

export default router;
