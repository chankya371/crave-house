import express from "express";
import {
  forgotPassword,
  verifyOTP,
  resetPassword
} from "../controllers/authController.js";

import { getMe, updateProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 Forgot Password
router.post("/forgot-password", forgotPassword);

// 🔑 Verify OTP
router.post("/verify-otp", verifyOTP);

// 🔄 Reset Password
router.post("/reset-password", resetPassword);

// 🧑‍💻 Get Current User Profile

router.get("/me", authMiddleware, getMe);
router.put("/update-profile", authMiddleware, updateProfile);
export default router;