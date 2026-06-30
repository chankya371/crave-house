import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import API from "../api/api";
import socket from "../socket/socket";
import "../styles/chat.css";

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const bottomRef = useRef(null);

  // Load customer chats
  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/chat/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChats(res.data);
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

      const res = await API.get(
        `/chat/${chat._id}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formatted = res.data.map((msg) => ({
        id: msg._id,
        chatId: chat._id,
        sender:
          msg.senderType === "admin"
            ? "admin"
            : "customer",
        text: msg.message,
        time: msg.createdAt,
      }));

      setMessages(formatted);

    } catch (err) {
      console.log(err);
    }
  };

  // Receive realtime message
  // Receive realtime message
useEffect(() => {
  const handleReceiveMessage = (data) => {

    if (
      selectedChat &&
      data.chatId === selectedChat._id
    ) {
      setMessages((prev) => [...prev, data]);
    }

    loadChats();
  };

  socket.on("receive_message", handleReceiveMessage);

  return () => {
    socket.off(
      "receive_message",
      handleReceiveMessage
    );
  };
}, [selectedChat]);

  // Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Send Message
  const sendMessage = () => {
    if (!message.trim()) return;
    if (!selectedChat) return;

    const token = localStorage.getItem("token");
    const user = jwtDecode(token);

    const data = {
      chatId: selectedChat._id,
      senderId: user.id,
      sender: "admin",
      text: message,
    };

    socket.emit("send_message", data);

    // ❌ DON'T ADD MESSAGE HERE
    // Socket will return it

    setMessage("");
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
              selectedChat?._id === chat._id
                ? "active"
                : ""
            }`}
            onClick={() => openChat(chat)}
          >

            <h4>
              {chat.customer.firstName}{" "}
              {chat.customer.lastName}
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

              {messages.map((msg) => (

                <div
                  key={msg.id}
                  className={
                    msg.sender === "admin"
                      ? "admin-message"
                      : "customer-message"
                  }
                >

                  <p>{msg.text}</p>

                  <span>
                    {new Date(msg.time).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>

                </div>

              ))}

              <div ref={bottomRef}></div>

            </div>

            <div className="chat-footer">

              <input
                type="text"
                placeholder="Type message..."
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />

              <button onClick={sendMessage}>
                Send
              </button>

            </div>

          </>

        )}

      </div>

    </div>
  );
}

export default ChatPage;