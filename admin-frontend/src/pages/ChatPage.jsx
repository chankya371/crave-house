import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import API from "../api/api";
import socket from "../socket/socket";
import "../styles/chat.css";

import { FcAddImage } from "react-icons/fc";
import { AiOutlineSend } from "react-icons/ai";

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // NEW
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadChats();
  }, []);

  // Load customer chats
  const loadChats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/chat/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChats(
        res.data.filter(
          (chat) => chat.customer && chat.customer.role === "user"
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // Open customer chat
  const openChat = async (chat) => {
    try {
      setSelectedChat(chat);

      socket.emit("join_chat", chat._id);

      const token = localStorage.getItem("token");

      const res = await API.get(`/chat/${chat._id}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formatted = res.data.map((msg) => ({
        id: msg._id,
        chatId: chat._id,
        sender: msg.senderType === "admin" ? "admin" : "customer",

        text: msg.message,

        // NEW
        attachment: msg.attachment,
        messageType: msg.messageType,

        time: msg.createdAt,
      }));

      setMessages(formatted);
    } catch (err) {
      console.log(err);
    }
  };

  // Receive realtime message
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessages((prev) => {
        if (!selectedChat) return prev;

        if (data.chatId !== selectedChat._id) {
          return prev;
        }

        const exists = prev.some((msg) => msg.id === data.id);

        if (exists) return prev;

        return [...prev, data];
      });

      loadChats();
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [selectedChat]);

  // Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Date Divider
  const formatDivider = (date) => {
    const d = new Date(date);

    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return "Today";
    }

    if (d.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Send Message
  const sendMessage = async () => {
    if (!selectedChat) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const user = jwtDecode(token);

    let attachment = "";
    let messageType = "text";

    // Upload image
    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      try {
        const upload = await API.post("/chat/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        attachment = upload.data.attachment;
        messageType = "image";
      } catch (err) {
        console.log(err);
        return;
      }
    }

    if (!message.trim() && !attachment) return;

    socket.emit("send_message", {
      chatId: selectedChat._id,
      senderId: user.id,
      sender: "admin",
      text: message.trim(),
      attachment,
      messageType,
    });

    setMessage("");
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="chat-page">
      {/* Sidebar */}

      <div className="chat-sidebar">
        <h2>Customer Support</h2>

        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`chat-user ${
              selectedChat?._id === chat._id ? "active" : ""
            }`}
            onClick={() => openChat(chat)}
          >
            <h4>
              {chat.customer.firstName} {chat.customer.lastName}
            </h4>

            <p>{chat.lastMessage}</p>
          </div>
        ))}
      </div>

      {/* Chat Window */}

      <div className="chat-window">
        {!selectedChat ? (
          <div className="empty-chat">
            <h2>Select Customer</h2>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <h2>
                {selectedChat.customer.firstName}{" "}
                {selectedChat.customer.lastName}
              </h2>
            </div>

            <div className="chat-body">
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
                        msg.sender === "admin" ? "admin" : "customer"
                      }`}
                    >
                      <div
                        className={
                          msg.sender === "admin"
                            ? "admin-message"
                            : "customer-message"
                        }
                      >
                        {/* Image */}
                        {msg.messageType === "image" && msg.attachment && (
                          <div className="chat-image-wrapper">
                            <img
                              src={`http://localhost:5000/uploads/chat/${msg.attachment}`}
                              alt="Shared"
                              className="chat-image"
                              loading="lazy"
                              onClick={() =>
                                setPreviewImage(
                                  `http://localhost:5000/uploads/chat/${msg.attachment}`
                                )
                              }
                            />
                          </div>
                        )}
                        {/* Text */}
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

            {/* Image Preview */}

            {image && (
              <div className="selected-image-preview">
                <div className="preview-card">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="preview-image"
                  />

                  <div className="preview-details">
                    <span className="preview-name">{image.name}</span>

                    <span className="preview-size">
                      {(image.size / 1024).toFixed(1)} KB
                    </span>
                  </div>

                  <button
                    className="remove-image"
                    onClick={() => {
                      setImage(null);

                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {previewImage && (
              <div className="image-preview-modal" onClick={() => setPreviewImage(null)}>
                <span className="close-preview">✕</span>
                <img
                  className="preview-full-image"
                  src={previewImage}
                  alt="Preview"
                  onClick={(e)=>e.stopPropagation()}
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
                  if (e.target.files[0]) {
                    setImage(e.target.files[0]);
                  }
                }}
              />

              {/* Camera Button */}
              {/* Camera Button */}
<button
  type="button"
  className="image-btn"
  onClick={() => fileInputRef.current.click()}
  disabled={!selectedChat}
>
  <FcAddImage size={28} />
</button>

{/* Message Input */}
<input
  type="text"
  placeholder="Type message..."
  value={message}
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
  disabled={!selectedChat}
>
  <AiOutlineSend size={24} />
</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
