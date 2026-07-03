import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderType: {
      type: String,
      enum: ["customer", "admin"],
      required: true,
    },

    message: {
      type: String,
      default: "",
      trim: true,
    },

    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },

    attachment: {
      type: String,
      default: "",
    },

    read: {
      type: Boolean,
      default: false,
    },

    delivered: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.pre("validate", function () {
  if (!this.message && !this.attachment) {
    throw new Error("Message or attachment is required");
  }
});

export default mongoose.model("Message", messageSchema);