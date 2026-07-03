import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import socket from "../socket/socket";
import API from "../api/api";
import "./../styles/profileComponentCSs/ChatModal.css";

import { FcAddImage } from "react-icons/fc";
import { AiOutlineSend } from "react-icons/ai";

function ChatModal() {
 const [message, setMessage] = useState("");
const [chatId, setChatId] = useState(null);
const [messages, setMessages] = useState([]);

const [image, setImage] = useState(null);
const [preview, setPreview] = useState("");

// NEW
const [selectedImage, setSelectedImage] = useState("");

const bottomRef = useRef(null);
const fileInputRef = useRef(null);

  // Create Chat
  useEffect(() => {
    const createChat = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.post(
          "/chat",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setChatId(res.data._id);

        socket.emit("join_chat", res.data._id);
      } catch (err) {
        console.error(err);
      }
    };

    createChat();
  }, []);

  // Load Messages
  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get(`/chat/${chatId}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessages(
          res.data.map((msg) => ({
            id: msg._id,
            sender: msg.senderType,
            text: msg.message,
            attachment: msg.attachment,
            messageType: msg.messageType,
            time: msg.createdAt,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    loadMessages();
  }, [chatId]);

  // Receive Live Messages
  useEffect(() => {
  const handleReceive = (data) => {
    setMessages((prev) => {
      const exists = prev.find(
        (msg) =>
          msg.id === data.id ||
          (msg.time === data.time &&
            msg.sender === data.sender &&
            msg.text === data.text &&
            msg.attachment === data.attachment)
      );

      if (exists) return prev;

      return [...prev, data];
    });
  };

  socket.on("receive_message", handleReceive);

  return () => {
    socket.off("receive_message", handleReceive);
  };
}, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const formatDivider = (date) => {
    const d = new Date(date);

    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";

    if (d.toDateString() === yesterday.toDateString())
      return "Yesterday";

    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Send Message
const sendMessage = async () => {
  if (!chatId) return;

  const token = localStorage.getItem("token");
  if (!token) return;

  const user = jwtDecode(token);

  let attachment = "";
  let messageType = "text";

  if (image) {
    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await API.post("/chat/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      attachment = res.data.attachment;
      messageType = "image";
    } catch (err) {
      console.error(err);
      return;
    }
  }

  if (!message.trim() && !attachment) return;

  socket.emit("send_message", {
    chatId,
    sender: "customer",
    senderId: user.id,
    text: message.trim(),
    attachment,
    messageType,
  });

  // DO NOT ADD MESSAGE HERE
  // Socket receive_message will update UI

  setMessage("");
  setImage(null);

  if (preview) {
    URL.revokeObjectURL(preview);
  }

  setPreview("");

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};


return (
  <div className="chat-modal">
    {/* Header */}
    <div className="chat-header">
      <div>
        <h3>💬 Crave House Support</h3>
        <span>🟢 Online</span>
      </div>
    </div>

    {/* Chat Body */}
    <div className="chat-body">
      {messages.length === 0 && (
        <div className="admin-message">
          <p>👋 Hello! How can we help you today?</p>
        </div>
      )}

      {messages.map((msg, index) => {
        const showDivider =
          index === 0 ||
          new Date(messages[index - 1].time).toDateString() !==
            new Date(msg.time).toDateString();

        return (
          <div key={msg.id}>
            {showDivider && (
              <div className="chat-divider">
                <span>{formatDivider(msg.time)}</span>
              </div>
            )}

            <div
              className={`message-row ${
                msg.sender === "customer"
                  ? "customer"
                  : "admin"
              }`}
            >
              <div
                className={
                  msg.sender === "customer"
                    ? "customer-message"
                    : "admin-message"
                }
              >
                {/* Image */}
               {msg.attachment && (
  <img
    src={`http://localhost:5000/uploads/chat/${msg.attachment}`}
    alt="chat"
    className="chat-image"
    onClick={() =>
      setSelectedImage(
        `http://localhost:5000/uploads/chat/${msg.attachment}`
      )
    }
    style={{ cursor: "pointer" }}
  />
)}

{msg.text && <p>{msg.text}</p>}

<span className="msg-time">
  {new Date(msg.time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}
</span>
              </div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef}></div>
    </div>

    {/* Selected Image Preview */}
   {preview && (
  <div className="selected-image-preview">
    <img
      src={preview}
      alt="Preview"
      className="preview-image"
    />

    <button
  type="button"
  className="remove-image"
  onClick={() => {
  if (preview) {
    URL.revokeObjectURL(preview);
  }

  setPreview("");
  setImage(null);

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
}}
>
  ✕
</button>
  </div>
)}

{/* NEW - Full Screen Image Viewer (AFTER CLICKING CHAT IMAGE) */}
{selectedImage && (
  <div
    className="image-viewer"
    onClick={() => setSelectedImage("")}
  >
    <span
      className="close-viewer"
      onClick={() => setSelectedImage("")}
    >
      ✕
    </span>

    <img
      src={selectedImage}
      alt="Full Preview"
      className="viewer-image"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
)}

    {/* Footer */}
    <div className="chat-footer">
      {/* Hidden File Input */}
      <input
  type="file"
  accept="image/*"
  ref={fileInputRef}
  style={{ display: "none" }}
  onChange={(e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (preview) {
    URL.revokeObjectURL(preview);
  }

  setImage(file);

  const imageUrl = URL.createObjectURL(file);

  setPreview(imageUrl);
}}
/>

     {/* Camera Button */}
<button
  type="button"
  className="image-btn"
  onClick={() => fileInputRef.current?.click()}
>
  <FcAddImage size={26} />
</button>

{/* Text Input */}
<input
  type="text"
  placeholder={
    chatId
      ? "Type your message..."
      : "Connecting..."
  }
  value={message}
  disabled={!chatId}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  }}
/>

{/* Send Button */}
<button
  type="button"
  className="send-btn"
  onClick={sendMessage}
  disabled={!chatId}
>
  <AiOutlineSend size={22} />
</button>
    </div>
  </div>
);
}

export default ChatModal;