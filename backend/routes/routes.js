import express from "express";
import { signup, verifyOTP } from "../controllers/signup.js";
import { resendOTP } from "../controllers/resendController.js";
import { userLogin, adminLogin } from "../controllers/login.js";
import { getAllUsers } from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addCategory, getCategories, deleteCategory, updateCategory  } from "../controllers/categoryController.js";
import upload from "../middleware/upload.js";
import { addFood, getAllFood, getFoodByCategory, deleteFood, updateFood, getSingleFood } from "../controllers/foodController.js";
import {createOrder, getOrders, updateOrderStatus, getMyOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", userLogin);
router.post("/admin/login", adminLogin);

router.get("/users", authMiddleware, getAllUsers);
router.get("/users/:id", authMiddleware, getAllUsers);


// Category routes
router.post("/category", authMiddleware, upload.single("image"), addCategory);
router.get("/category", getCategories);
router.delete("/category/:id", authMiddleware, deleteCategory);
router.put("/category/:id", authMiddleware, upload.single("image"), updateCategory);

// Food routes
router.post("/food", authMiddleware, upload.array("image", 5), addFood);
router.get("/food", getAllFood);
router.get("/food/category/:categoryId", getFoodByCategory);
router.delete("/food/:id", authMiddleware, deleteFood);
router.put(
  "/food/:id",
  authMiddleware,
  upload.array("image", 5), // ✅ MUST be "image"
  updateFood
);

router.get("/food/:id", getSingleFood);
// Order routes
router.post("/orders", authMiddleware, createOrder);
router.get("/orders", authMiddleware, getOrders);
router.put("/orders/:id", authMiddleware, updateOrderStatus);
router.get("/orders/my-orders", authMiddleware, getMyOrders);

// Cart routes

import {addToCart, getCart, updateCartQuantity, deleteCartItem} from "../controllers/cartController.js";

router.post("/cart", authMiddleware, addToCart);
router.get("/cart", authMiddleware, getCart);
router.put("/cart/:id", authMiddleware, updateCartQuantity);
router.delete("/cart/:id", authMiddleware, deleteCartItem);


// Wishlist routes
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/WishlistController.js";
router.post("/wishlist", authMiddleware, addToWishlist);
router.get("/wishlist", authMiddleware, getWishlist);
router.delete("/wishlist/:id", authMiddleware, removeFromWishlist);


// Address routes
import { addAddress, getAddresses, updateAddress, deleteAddress, saveCheckoutAddress } from "../controllers/addressController.js";
router.post("/address", authMiddleware, addAddress);
router.get("/address", authMiddleware, getAddresses);
router.put("/address/:id", authMiddleware, updateAddress);
router.delete("/address/:id", authMiddleware, deleteAddress);
router.post("/checkout-save", authMiddleware, saveCheckoutAddress);


// User settings routes
import { getUserSettings, updateNotificationSettings, deleteAccount } from "../controllers/userController.js";

router.get("/settings", authMiddleware, getUserSettings);
router.put("/settings/notifications", authMiddleware, updateNotificationSettings);
router.delete("/delete-account", authMiddleware, deleteAccount);


export default router;