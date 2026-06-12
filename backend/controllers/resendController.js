import User from "../models/User.js";
import { sendOTP } from "../utils/sendEmail.js";

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Update OTP + expiry
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min

    await user.save();

    // 4. Send OTP email
    await sendOTP(email, otp);

    res.status(200).json({
      message: "OTP resent successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error resending OTP",
      error: error.message
    });
  }
};

