import express from "express";
import Solve from "../models/Solve.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const solves = await Solve.aggregate([
      {
        $group: {
          _id: "$nickname",
          solves: { $sum: 1 },
          last_solve: { $max: "$solved_at" }
        }
      },
      { $sort: { solves: -1, last_solve: 1 } }
    ]);

    const leaderboard = solves.map((s, i) => ({
      rank: i + 1,
      nickname: s._id,
      solves: s.solves,
      last_solve: s.last_solve
    }));

    const latest = await Solve.findOne().sort({ solved_at: -1 });

    const counts = await Solve.aggregate([
      { $group: { _id: "$challenge", solves: { $sum: 1 } } }
    ]);

    res.json({
      leaderboard,
      latest,
      counts: Object.fromEntries(counts.map(c => [c._id, c.solves]))
    });
  } catch (err) {
    res.status(500).json({ error: "DB query failed" });
  }
});

export default router;
