import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/orderSuccess.css";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✓</div>

        <h1>Order Placed Successfully!</h1>

        <p>
          Thank you for your order. Your delicious food is being prepared and
          will arrive soon.
        </p>

        <div className="order-info">
          <div>
            <span>Order ID</span>
            <strong>#FD12345</strong>
          </div>

          <div>
            <span>Estimated Delivery</span>
            <strong>30 - 45 mins</strong>
          </div>
        </div>

        <div className="success-buttons">
          <button onClick={() => navigate("/")}>
            Continue Shopping
          </button>

          <button
            className="track-btn"
            onClick={() => navigate("/orders")}
          >
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;