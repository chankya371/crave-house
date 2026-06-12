import User from "../models/User.js";
import { sendOTP } from "../utils/sendEmail.js";
import bcrypt from "bcrypt";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await User.findByIdAndUpdate(user._id, {
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    await sendOTP(email, otp);

    res.json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error sending OTP",
    });
  }
};
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  res.json({ message: "OTP verified" });
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  if (user.otpExpiry < Date.now()) {
    return res.status(400).json({
      message: "OTP expired",
    });
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  await User.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    otp: null,
    otpExpiry: null,
  });

  res.json({
    message: "Password reset successful",
  });
};

//profile api

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobile,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstName,
        lastName,
        email,
        mobile,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};
