import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const notifyCartUpdate = (items) => {
    const totalCount = items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { count: totalCount },
      })
    );
  };

  const fetchCart = useCallback(async () => {
    try {
      const res = await API.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(res.data);
      notifyCartUpdate(res.data);
    } catch (err) {
      console.log(
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQty = async (id, newQty) => {
    if (newQty < 1) return;

    try {
      const res = await API.put(
        `/cart/${id}`,
        { quantity: newQty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems(res.data);
      notifyCartUpdate(res.data);
    } catch (err) {
      console.log(
        err.response?.data || err.message
      );
    }
  };

  const deleteItem = async (id) => {
    try {
      const res = await API.delete(
        `/cart/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems(res.data);
      notifyCartUpdate(res.data);
    } catch (err) {
      console.log(
        err.response?.data || err.message
      );
    }
  };

  const getImage = (food) =>
    food?.images?.length
      ? `http://localhost:5000${food.images[0]}`
      : "https://via.placeholder.com/100";

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + item.food.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  if (loading)
    return (
      <h2 className="loading-cart">
        Loading...
      </h2>
    );

  return (
    <div className="cart-container">
      <div className="cart-left">
        <div className="cart-header-row">
          <h2>Shopping Cart</h2>
          <span>{totalItems} Items</span>
        </div>

        <div className="cart-table-head">
          <span>PRODUCT DETAILS</span>
          <span>QUANTITY</span>
          <span>PRICE</span>
          <span>TOTAL</span>
        </div>

        {cartItems.length === 0 ? (
          <p className="empty-cart">
            Your cart is empty
          </p>
        ) : (
          cartItems.map((item) => (
            <div
              className="cart-row"
              key={item._id}
            >
              <div className="product-details">
                <img
                  src={getImage(item.food)}
                  alt={item.food.name}
                />

                <div>
                  <h4>{item.food.name}</h4>

                  <button
                    onClick={() =>
                      deleteItem(item._id)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="qty-controls">
                <button
                  onClick={() =>
                    updateQty(
                      item._id,
                      item.quantity - 1
                    )
                  }
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    updateQty(
                      item._id,
                      item.quantity + 1
                    )
                  }
                >
                  +
                </button>
              </div>

              <div>₹{item.food.price}</div>

              <div>
                ₹
                {item.food.price *
                  item.quantity}
              </div>
            </div>
          ))
        )}

        <p
          className="continue-shopping"
          onClick={() => navigate("/")}
        >
          ← Continue Shopping
        </p>
      </div>

      <div className="cart-right">
        <h3>Order Summary</h3>

        <div className="summary-row">
          <span>ITEMS {totalItems}</span>
          <span>₹{subtotal}</span>
        </div>

        <p className="summary-label">
          SHIPPING
        </p>

        <select>
          <option>
            Standard Delivery - ₹50
          </option>
        </select>

        <p className="summary-label">
          PROMO CODE
        </p>

        <input
          type="text"
          placeholder="Enter your code"
        />

        <button className="apply-btn">
          APPLY
        </button>

        <div className="summary-total">
          <span>TOTAL COST</span>
          <span>₹{total}</span>
        </div>

        <button
          className="checkout-btn"
          onClick={() => {
            if (!token) {
              navigate("/login");
            } else if (
              cartItems.length > 0
            ) {
              navigate("/checkout");
            }
          }}
        >
          CHECKOUT
        </button>
      </div>
    </div>
  );
}

export default Cart;