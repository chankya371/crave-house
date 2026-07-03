import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

export const createChat = async (req, res) => {
  try {
    const customerId = req.user.id;

    let chat = await Chat.findOne({
      customer: customerId,
    });

    if (!chat) {
      chat = await Chat.create({
        customer: customerId,
      });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      chat: req.params.chatId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate(
        "customer",
        "firstName lastName email role"
      )
      .sort({ updatedAt: -1 });

    const filteredChats = chats.filter(
      (chat) =>
        chat.customer &&
        chat.customer.role === "user"
    );

    res.json(filteredChats);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


export const uploadChatImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    res.status(200).json({
      attachment: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};