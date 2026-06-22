import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;
    const userId = req.user.id;

    const existing = await Cart.findOne({
      user: userId,
      food: foodId,
    });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json(existing);
    }

    const cart = await Cart.create({
      user: userId,
      food: foodId,
      quantity,
    });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({
      user: req.user.id,
    }).populate("food");

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    cart.quantity = Number(quantity);
    await cart.save();

    const updatedCart = await Cart.find({
      user: req.user.id,
    }).populate("food");

    res.json(updatedCart);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    await Cart.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    const updatedCart = await Cart.find({
      user: req.user.id,
    }).populate("food");

    res.json(updatedCart);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};