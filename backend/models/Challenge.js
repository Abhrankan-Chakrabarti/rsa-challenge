import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  n: { type: String, required: true },
  c: { type: String, required: true },
  e: { type: Number, required: true },
  sha256: { type: String, required: true }
});

export default mongoose.model("Challenge", challengeSchema);
