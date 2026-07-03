import React, { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/profileComponentCSs/ordersTab.css";
// import { useNavigate } from "react-router-dom";
// import HelpCenter from "../pages/HelpCenter";
function OrdersTab({ setActiveTab }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data.orders);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const isTrackable = (status) => {
    const trackStatuses = [
      "pending",
      "processing",
      "confirmed",
      "out for delivery",
    ];

    return trackStatuses.includes(status?.toLowerCase());
  };

  const isDelivered = (status) => {
    return ["delivered", "success"].includes(status?.toLowerCase());
  };

  if (loading) return <h3>Loading orders...</h3>;

  if (!orders.length) {
    return <h2>No orders found</h2>;
  }

  return (
    <div className="orders-wrapper">
      <h2>Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className="order-history-card">
          <div className="order-top">
            <div>
              <h3>Order #{order._id.slice(-6)}</h3>

              <p>
                {order.address?.street}, {order.address?.city},{" "}
                {order.address?.pincode}
              </p>

              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>

            <div className="order-status">{order.status}</div>
          </div>

          <hr />

          <div className="order-middle">
            <div>
              {order.items.map((item) => (
                <p key={item._id}>
                  {item.food?.name} × {item.quantity}
                </p>
              ))}
            </div>

            <h4>₹{order.totalAmount}</h4>
          </div>

          <div className="order-buttons">
            {isTrackable(order.status) && (
              <button className="track-btn">TRACK ORDER</button>
            )}

            {isDelivered(order.status) && (
              <button className="reorder-btn">REORDER</button>
            )}

            <button className="help-btn" onClick={() => setActiveTab("help")}>
              HELP
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrdersTab;
