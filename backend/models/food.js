import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
   images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category",
      required: true
    },
  description: {
  type: String,
  default: "N/A"
}
    
  },
  { timestamps: true }
);

export default mongoose.model("Food", foodSchema);