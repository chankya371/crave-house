import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/foodPage.css";
import { toast } from "react-toastify";
import { FaHeart, FaArrowLeft } from "react-icons/fa";

function FoodPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [qty, setQty] = useState({});
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  const fetchFoods = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get(`/food/category/${id}`);
      const data = res.data?.data || [];

      setFoods(data);

      if (data.length > 0 && data[0].category?.name) {
        setCategoryName(data[0].category.name);
      }

      const initialQty = {};
      data.forEach((item) => {
        initialQty[item._id] = 1;
      });

      setQty(initialQty);
    } catch (err) {
      console.log(err);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const getImage = (food) => {
    return food.images?.length
      ? `http://localhost:5000${food.images[0]}`
      : "https://via.placeholder.com/300";
  };

  const inc = (e, foodId) => {
    e.stopPropagation();

    setQty((prev) => ({
      ...prev,
      [foodId]: prev[foodId] + 1,
    }));
  };

  const dec = (e, foodId) => {
    e.stopPropagation();

    setQty((prev) => ({
      ...prev,
      [foodId]:
        prev[foodId] > 1
          ? prev[foodId] - 1
          : 1,
    }));
  };

  const addToCart = async (e, food) => {
    e.stopPropagation();

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

      window.dispatchEvent(new Event("cartUpdated"));

      toast.success(`${food.name} added to cart`);

      setQty((prev) => ({
        ...prev,
        [food._id]: 1,
      }));
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to add to cart"
      );
    }
  };

  const addToWishlist = async (e, food) => {
    e.stopPropagation();

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
    } catch {
      toast.error("Failed to add wishlist");
    }
  };

  return (
    <div className="food-page">
      <div className="food-page-header">
        <button
          className="food-back-btn"
          onClick={() => navigate("/categories")}
        >
          <FaArrowLeft />
          Back
        </button>

        <h2 className="food-page-title">
          {categoryName || "Category Foods"}
        </h2>
      </div>

      {loading ? (
        <p className="food-page-loading">
          Loading foods...
        </p>
      ) : foods.length === 0 ? (
        <p className="food-page-loading">
          No foods found
        </p>
      ) : (
        <div className="food-page-grid">
          {foods.map((food) => (
            <div
              className="food-page-card"
              key={food._id}
              onClick={() =>
                navigate(`/food/${food._id}`)
              }
            >
              <div className="food-page-img-wrap">
                <img
                  src={getImage(food)}
                  alt={food.name}
                />
              </div>

              <h4 className="food-page-name">
                {food.name}
              </h4>

              <div className="food-page-price">
                ₹{food.price}
              </div>

              <div className="food-hover-actions">
                <div className="food-qty-box">
                  <button
                    onClick={(e) =>
                      dec(e, food._id)
                    }
                  >
                    -
                  </button>

                  <span>
                    {qty[food._id]}
                  </span>

                  <button
                    onClick={(e) =>
                      inc(e, food._id)
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className="food-cart-btn"
                  onClick={(e) =>
                    addToCart(e, food)
                  }
                >
                  Add
                </button>

                <button
                  className="food-wishlist-btn"
                  onClick={(e) =>
                    addToWishlist(e, food)
                  }
                >
                  <FaHeart />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FoodPage;