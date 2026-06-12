import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const createOrder = async (req, res) => {
  try {
    const { address, paymentMethod } = req.body;

    const cartItems = await Cart.find({
      user: req.user.id,
    }).populate("food");

    if (!cartItems.length) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const items = cartItems.map((item) => ({
      food: item.food._id,
      quantity: item.quantity,
    }));

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.food.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      address,
      paymentMethod,
      paymentStatus: paymentMethod === "Online" ? "Paid" : "Pending",
    });

    await Cart.deleteMany({ user: req.user.id });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



// 🟢 GET ALL ORDERS
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email mobile") // ✅ FIXED
      .populate({
        path: "items.food",
        select: "name category",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .sort({ createdAt: -1 }); // latest first

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 🟢 UPDATE ORDER STATUS / PAYMENT
export const updateOrderStatus = async (req, res) => {
  try {
    console.log("ID:", req.params.id);
    console.log("BODY:", req.body);

    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    if (status === "Delivered") {
      order.paymentStatus = "Paid";
    }

    await order.save();

    res.json(order);
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate({
        path: "items.food",
        select: "name image price",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};