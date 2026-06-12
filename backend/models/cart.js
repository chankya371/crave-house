import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;