import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/foodHome.css";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa";

function FoodList() {
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [qty, setQty] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);

      const res = await API.get("/food?limit=10");
      const data = res.data?.data || [];

      setFoods(data);

      const initialQty = {};
      data.forEach((item) => {
        initialQty[item._id] = 1;
      });

      setQty(initialQty);
    } catch {
      toast.error("Failed to load foods");
    } finally {
      setLoading(false);
    }
  };

  const getImage = (food) => {
    return food.images?.length
      ? `http://localhost:5000${food.images[0]}`
      : "https://via.placeholder.com/300";
  };

  const inc = (id) => {
    setQty((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  const dec = (id) => {
    setQty((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  const addToCart = async (food) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      await API.post(
        "/cart",
        {
          foodId: food._id,
          quantity: qty[food._id],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Added to cart");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {
      toast.error("Failed to add cart");
    }
  };

  const addToWishlist = async (food) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      await API.post(
        "/wishlist",
        {
          foodId: food._id,
          name: food.name,
          price: food.price,
          image: food.images?.[0] || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Added to wishlist");
    } catch (err) {
      console.log(err.response?.data);
      toast.error("Failed to add wishlist");
    }
  };

  return (
    <section className="popular-food-section">
      <div className="food-header">
        <h2>🔥 Best Selling Foods</h2>

        <button onClick={() => navigate("/categories")}>
          View All
        </button>
      </div>

      {loading ? (
        <p className="popular-food-loading">
          Loading foods...
        </p>
      ) : (
        <div className="popular-food-grid">
          {foods.map((food) => (
            <div
              className="popular-food-card"
              key={food._id}
            >
              <div
                className="popular-food-img-wrap"
                onClick={() =>
                  navigate(`/food/${food._id}`)
                }
              >
                <img
                  src={getImage(food)}
                  alt={food.name}
                />
              </div>

              <h4>{food.name}</h4>

              <div className="food-price">
                ₹{food.price}
              </div>

              <div className="hover-actions">
                <div className="qty-box">
                  <button
                    onClick={() => dec(food._id)}
                  >
                    -
                  </button>

                  <span>
                    {qty[food._id]}
                  </span>

                  <button
                    onClick={() => inc(food._id)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="cart-btn"
                  onClick={() => addToCart(food)}
                >
                  Add
                </button>

                <button
                  className="wishlist-hover-btn"
                  onClick={() =>
                    addToWishlist(food)
                  }
                >
                  <FaHeart />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default FoodList;