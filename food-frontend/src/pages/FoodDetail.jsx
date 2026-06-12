import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/foodDetail.css";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
} from "lucide-react";

function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState(null);
  const [qty, setQty] = useState(1);
  const [wishlistLoading, setWishlistLoading] =
    useState(false);
  const [cartLoading, setCartLoading] =
    useState(false);

  const fetchFood = useCallback(async () => {
    try {
      const res = await API.get(`/food/${id}`);
      setFood(res.data);
    } catch (err) {
      toast.error("Failed to fetch food details");
      console.log(err);
    }
  }, [id]);

  useEffect(() => {
    fetchFood();
  }, [fetchFood]);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const addToCart = async () => {
    const token = getToken();

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      setCartLoading(true);

      await API.post(
        "/cart",
        {
          foodId: food._id,
          quantity: qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.dispatchEvent(new Event("cartUpdated"));

      toast.success("Added to cart");
    } catch (err) {
      console.log(err.response?.data || err);
      toast.error(
        err.response?.data?.message ||
          "Failed to add to cart"
      );
    } finally {
      setCartLoading(false);
    }
  };

  const addToWishlist = async () => {
    const token = getToken();

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      setWishlistLoading(true);

      await API.post(
        "/wishlist",
        {
          foodId: food._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Added to wishlist");
    } catch (err) {
      console.log(err.response?.data || err);

      toast.error(
        err.response?.data?.message ||
          "Failed to add to wishlist"
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  if (!food) {
    return (
      <div className="food-loading">
        Loading delicious food...
      </div>
    );
  }

  return (
    <div className="food-detail-page">
      <div className="food-detail-card">
        {/* LEFT */}
        <div className="food-left">
          <button
            className="back-detail-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="food-image-box">
            <img
              src={
                food.images?.length
                  ? `http://localhost:5000${food.images[0]}`
                  : "https://via.placeholder.com/500"
              }
              alt={food.name}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="food-right">
          <div className="food-badge">
            🔥 Best Seller
          </div>

          <h1>{food.name}</h1>

          <p className="food-desc">
            {food.description ||
              "Freshly prepared delicious food made with premium ingredients and delivered hot to your doorstep."}
          </p>

          <div className="food-price-section">
            <span className="price-label">
              Total Price
            </span>

            <div className="price-detail">
              ₹{food.price * qty}
            </div>
          </div>

          <div className="food-action">
            <div className="qty-detail">
              <button
                onClick={() =>
                  qty > 1 && setQty(qty - 1)
                }
              >
                -
              </button>

              <span>{qty}</span>

              <button
                onClick={() => setQty(qty + 1)}
              >
                +
              </button>
            </div>

            <button
              className="wishlist-detail-btn"
              onClick={addToWishlist}
              disabled={wishlistLoading}
            >
              <Heart size={18} />
            </button>

            <button
              className="add-cart-detail"
              onClick={addToCart}
              disabled={cartLoading}
            >
              <ShoppingCart size={18} />
              {cartLoading
                ? "Adding..."
                : "Add To Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodDetail;