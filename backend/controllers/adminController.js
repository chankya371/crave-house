import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const users = await User.find({ role: { $ne: "admin" } })
    .select("-password");

  res.json(users);
};

export const getUserById = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const user = await User.findById(req.params.id)
    .select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};