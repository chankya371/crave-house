import { useState } from "react";
import ChatModal from "./ChatModal";
import "../styles/profileComponentCSs/HelpCenter.css";

function HelpCenter() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="help-center">
      {!showChat ? (
        <>
          <h2>Help Center</h2>

          <div className="help-card">
            <h3>Need Help?</h3>

            <p>
              Chat with our support team for order updates,
              payments, delivery issues or any questions.
            </p>

            <button
              className="chat-btn"
              onClick={() => setShowChat(true)}
            >
              💬 Start Live Chat
            </button>
          </div>
        </>
      ) : (
        <ChatModal />
      )}
    </div>
  );
}

export default HelpCenter;