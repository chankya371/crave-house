import "../styles/profileComponentCSs/HelpCenter.css";

function HelpCenter({ onOpenChat }) {
  return (
    <div className="help-center">
      <h2>Help Center</h2>

      <div className="help-card">
        <h3>Need Help?</h3>

        <p>
          Chat with our support team for order updates,
          payments, delivery issues or any questions.
        </p>

        <button
          className="chat-btn"
          onClick={onOpenChat}
        >
          💬 Start Live Chat
        </button>
      </div>
    </div>
  );
}

export default HelpCenter;