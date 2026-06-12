import User from "../models/User.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";


// GET USER SETTINGS
export const getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("recommendations");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      recommendations: user.recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE NOTIFICATION SETTINGS
export const updateNotificationSettings = async (req, res) => {
  try {
    const { recommendations } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        recommendations,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      recommendations: user.recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE ACCOUNT
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.deleteMany({ user: userId });
    await Order.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};