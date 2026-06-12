import User from "../models/User.js";
import bcrypt from "bcrypt";
import { sendOTP } from "../utils/sendEmail.js";

export const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      firstName,
      lastName,
      mobile: req.body.mobile,
      countryCode: req.body.countryCode,
      email,
      password: hashedPassword,
      role: "user",
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
      isVerified: false
    });

    // ✅ call function
    await sendOTP(email, otp);

    res.json({
      message: "OTP sent to email",
      email: user.email
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Signup error" });
  }
};



// verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Account verified successfully" });

  } catch (error) {
    res.status(500).json({ message: "Verification error" });
  }
};