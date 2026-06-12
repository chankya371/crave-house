import Wishlist from "../models/Wishlist.js";

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { foodId, name, price, image } = req.body;
    const userId = req.user.id;

    const existingItem = await Wishlist.findOne({
      user: userId,
      food: foodId,
    });

    if (existingItem) {
      return res.status(400).json({
        message: "Item already in wishlist",
      });
    }

    const wishlist = await Wishlist.create({
      user: userId,
      food: foodId,
      name,
      price,
      image,
    });

    res.status(201).json({
      message: "Item added to wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!wishlistItem) {
      return res.status(404).json({
        message: "Wishlist item not found",
      });
    }

    await Wishlist.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Item removed from wishlist",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};