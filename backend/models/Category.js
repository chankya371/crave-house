import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: String,
  description: String,
});

export default mongoose.model("Category", categorySchema);