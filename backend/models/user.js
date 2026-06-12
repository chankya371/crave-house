import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
  type: String,
  required: true,
},

  countryCode: {
    type: String,
    required: true,
  },

  mobile: {
    type: Number,
    required: true,
  },

  email: {
    type: String,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  otp: {
    type: String,
  },

  otpExpiry: {
    type: Date,
  },

  // SETTINGS
  recommendations: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("User", userSchema);