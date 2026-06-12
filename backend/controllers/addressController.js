import Address from "../models/Address.js";

// Add address manually
export const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      fullAddress,
      city,
      pincode,
    } = req.body;

    const newAddress = await Address.create({
      user: req.user.id,
      fullName,
      phone,
      email,
      fullAddress,
      city,
      pincode,
    });

    res.status(201).json({
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get user addresses
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    const updated = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Address updated successfully",
      address: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    await Address.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Auto save checkout address
export const saveCheckoutAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      fullAddress,
      city,
      pincode,
    } = req.body;

    const existing = await Address.findOne({
      user: req.user.id,
      fullAddress,
      city,
      pincode,
    });

    if (existing) {
      return res.status(200).json({
        message: "Address already exists",
        address: existing,
      });
    }

    const address = await Address.create({
      user: req.user.id,
      fullName,
      phone,
      email,
      fullAddress,
      city,
      pincode,
    });

    res.status(201).json({
      message: "Checkout address saved",
      address,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};