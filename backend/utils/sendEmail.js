import nodemailer from "nodemailer";

export const sendOTP = async (email, otp) => {
  try {
    console.log("EMAIL:", process.env.EMAIL);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    });

    console.log("OTP sent successfully");
  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};