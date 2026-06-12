import { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/order.css";

function Order() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");

      const activeOrders = res.data.filter(
        (order) =>
          order.status !== "Delivered" &&
          order.status !== "Cancelled"
      );

      setOrders(activeOrders);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status });
      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="order-container">
      

      <div className="table-wrapper">
        <table className="order-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Order ID</th>
              <th>Product</th>
              <th>Category</th>
              <th>Customer Details</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No active orders
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>

                  <td>#{order._id.slice(-6).toUpperCase()}</td>

                  <td>
                    {order.items?.map((item, i) => (
                      <div key={i}>
                        {item.food?.name || "N/A"} × {item.quantity}
                      </div>
                    ))}
                  </td>

                  <td>
                    {order.items?.map((item, i) => (
                      <div key={i}>
                        {item.food?.category?.name || "N/A"}
                      </div>
                    ))}
                  </td>

                  <td>
                    {order.address ? (
                      <>
                        <div>
                          <strong>{order.address.fullName}</strong>
                        </div>

                        <div>{order.address.phone}</div>

                        <div>{order.address.email}</div>

                        <div>{order.address.street}</div>

                        <div>
                          {order.address.city} -{" "}
                          {order.address.pincode}
                        </div>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </td>

                  <td>
                    <span
                      className={`payment ${order.paymentStatus}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>

                  <td>
                    <span className={`status ${order.status}`}>
                      {order.status}
                    </span>
                  </td>

                  <td>
                    {order.status === "Pending" && (
                      <button
                        className="accept-btn"
                        onClick={() =>
                          updateStatus(order._id, "Preparing")
                        }
                      >
                        Accept
                      </button>
                    )}

                    {order.status === "Preparing" && (
                      <button
                        className="deliver-btn"
                        onClick={() =>
                          updateStatus(order._id, "On the way")
                        }
                      >
                        On the way
                      </button>
                    )}

                    {order.status === "On the way" && (
                      <button
                        className="deliver-btn"
                        onClick={() =>
                          updateStatus(order._id, "Delivered")
                        }
                      >
                        Deliver
                      </button>
                    )}

                    {(order.status === "Pending" ||
                      order.status === "Preparing" ||
                      order.status === "On the way") && (
                      <button
                        className="cancel-btn"
                        onClick={() =>
                          updateStatus(order._id, "Cancelled")
                        }
                      >
                        Cancel
                      </button>
                    )}

                    {(order.status === "Delivered" ||
                      order.status === "Cancelled") && (
                      <span className="accepted">
                        {order.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Order;