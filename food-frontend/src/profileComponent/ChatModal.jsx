import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import socket from "../socket/socket";
import API from "../api/api";
import "./../styles/profileComponentCSs/ChatModal.css";

function ChatModal({ onClose }) {
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);

  // Create or Get Chat
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

        console.log("✅ Joined Chat:", res.data._id);
      } catch (err) {
        console.error(err);
      }
    };

    createChat();
  }, []);

  // Load Previous Messages
  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get(
          `/chat/${chatId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formatted = res.data.map((msg) => ({
          id: msg._id,
          sender: msg.senderType,
          text: msg.message,
          time: msg.createdAt,
        }));

        setMessages(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    loadMessages();
  }, [chatId]);

  // Receive Live Messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Send Message
  const sendMessage = () => {
    if (!chatId) return;
    if (!message.trim()) return;

    const token = localStorage.getItem("token");

    if (!token) return;

    const user = jwtDecode(token);

    const data = {
      chatId,
      sender: "customer",
      senderId: user.id,
      text: message,
    };

    socket.emit("send_message", data);

    setMessage("");
  };

  return (
    <div className="chat-overlay">
      <div className="chat-modal">

        {/* Header */}
        <div className="chat-header">
          <div>
            <h3>💬 Crave House Support</h3>
            <span>🟢 Online</span>
          </div>

          <button onClick={onClose}>✕</button>
        </div>

        {/* Messages */}
        <div className="chat-body">

          {messages.length === 0 && (
            <div className="admin-message">
              <p>👋 Hello! How can we help you today?</p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.sender === "customer"
                  ? "customer-message"
                  : "admin-message"
              }
            >
              <p>{msg.text}</p>

              {msg.time && (
                <span className="msg-time">
                  {new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
          ))}

          <div ref={bottomRef}></div>

        </div>

        {/* Footer */}
        <div className="chat-footer">

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

          <button
            onClick={sendMessage}
            disabled={!chatId}
          >
            ➤
          </button>

        </div>

      </div>
    </div>
  );
}

export default ChatModal;