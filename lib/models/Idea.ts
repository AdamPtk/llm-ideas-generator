import mongoose from "mongoose";

const IdeaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  userId: { type: String, required: true },
  prompt: { type: String, required: true },
  usage: {
    input_tokens: { type: Number },
    output_tokens: { type: Number },
    total_tokens: { type: Number },
  },
  html: { type: String, required: true },
  model: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export default mongoose.models.Idea || mongoose.model("Idea", IdeaSchema);
