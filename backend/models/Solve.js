import mongoose from "mongoose";

const solveSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  challenge: { type: String, required: true },
  sha256: { type: String, required: true },
  solved_at: { type: Date, default: Date.now }
});

export default mongoose.model("Solve", solveSchema);
