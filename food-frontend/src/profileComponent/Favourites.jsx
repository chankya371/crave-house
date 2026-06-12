import React, { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/profileComponentCSs/Favourites.css";
import { FaHeart, FaTrash, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";

function Favourites() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Wishlist Data:", res.data);

      setWishlist(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeWishlistItem = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/wishlist/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist(wishlist.filter((item) => item._id !== id));
      toast.success("Removed from favourites");
    } catch (err) {
      console.log(err);
      toast.error("Failed to remove item");
    }
  };

  const addToCart = async (item) => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/cart/add",
        {
          foodId: item.food,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Added to cart");
    } catch (err) {
      console.log(err);
      toast.error("Failed to add to cart");
    }
  };

  if (loading) return <h3>Loading favourites...</h3>;

  if (!wishlist.length) {
    return (
      <div className="empty-favourites">
        <FaHeart className="empty-icon" />
        <p>Your favourite items will appear here.</p>
      </div>
    );
  }

  return (
    <div className="favourites-container">
      <h2>Favourites</h2>

      <div className="wishlist-grid">
        {wishlist.map((item) => (
          <div key={item._id} className="wishlist-card">
            <img
              src={`http://localhost:5000${item.image}`}
              alt={item.name}
            />

            <div className="wishlist-info">
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
            </div>

            <div className="wishlist-actions">
              <button
                className="cart-btn"
                onClick={() => addToCart(item)}
              >
                <FaShoppingCart />
                Add to Cart
              </button>

              <button
                className="remove-btn"
                onClick={() => removeWishlistItem(item._id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favourites;