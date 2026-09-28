import mongoose from "mongoose";

const solveSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  challenge: { type: String, required: true },
  sha256: { type: String, required: true },
  solved_at: { type: Date, default: Date.now }
});

// One solve per nickname per challenge, enforced by the database
// itself. The app-level findOne check has a race window under
// concurrent submissions; this index is the real guard.
solveSchema.index({ nickname: 1, challenge: 1 }, { unique: true });

export default mongoose.model("Solve", solveSchema);
