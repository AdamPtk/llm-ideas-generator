import mongoose from "mongoose";

const IdeaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  userId: { type: String, required: true },
  prompt: { type: String, required: true },
  html: { type: String, required: true },
  model: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export default mongoose.models.Idea || mongoose.model("Idea", IdeaSchema);
