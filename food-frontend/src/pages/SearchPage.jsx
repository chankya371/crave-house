import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/searchPage.css";
import {
  Search,
  ArrowLeft,
  Flame,
} from "lucide-react";

function SearchPage() {
  const { keyword } = useParams();
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);

        const res = await API.get("/food?limit=100");

        const data = res.data?.data || [];

        // 🔥 SEARCH BY FOOD NAME + CATEGORY
        const filtered = data.filter((food) => {
          const searchText = keyword.toLowerCase();

          const foodName =
            food.name?.toLowerCase() || "";

          const categoryName =
            food.category?.name?.toLowerCase() ||
            "";

          return (
            foodName.includes(searchText) ||
            categoryName.includes(searchText)
          );
        });

        setFoods(filtered);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [keyword]);

  const getImage = (food) => {
    return food.images?.length
      ? `http://localhost:5000${food.images[0]}`
      : "https://via.placeholder.com/300";
  };

  return (
    <div className="search-page">
      {/* BACKGROUND GLOW */}
      <div className="search-bg-glow glow-1"></div>
      <div className="search-bg-glow glow-2"></div>

      {/* HEADER */}
      <div className="search-header">
        <button
          className="search-back-btn"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="search-title-box">
          <div className="search-icon-wrap">
            <Search size={28} />
          </div>

          <div>
            <h1 className="search-title">
              Search Results
            </h1>

            <p className="search-subtitle">
              Showing delicious matches for
              <span> "{keyword}"</span>
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="search-empty-state">
          <div className="loader"></div>

          <p>Searching delicious foods...</p>
        </div>
      ) : foods.length === 0 ? (
        <div className="search-empty-state">
          <div className="empty-fire">
            <Flame size={70} />
          </div>

          <h2>No Foods Found</h2>

          <p>
            We couldn't find any food or category
            matching
            <span> "{keyword}"</span>
          </p>

          <button
            className="explore-btn"
            onClick={() => navigate("/")}
          >
            Explore Menu
          </button>
        </div>
      ) : (
        <>
          {/* RESULT COUNT */}
          <div className="search-count-box">
            <span>{foods.length}</span> delicious item
            {foods.length > 1 ? "s" : ""} found
          </div>

          {/* FOOD GRID */}
          <div className="search-food-grid">
            {foods.map((food) => (
              <div
                className="search-food-card"
                key={food._id}
                onClick={() =>
                  navigate(`/food/${food._id}`)
                }
              >
                {/* IMAGE */}
                <div className="search-img-box">
                  <img
                    src={getImage(food)}
                    alt={food.name}
                  />

                  <div className="img-overlay"></div>
                </div>

                {/* CONTENT */}
                <div className="search-food-content">
                  <h3 className="search-food-name">
                    {food.name}
                  </h3>

                  {/* CATEGORY */}
                  <p className="search-category">
                    {food.category?.name ||
                      "Fast Food"}
                  </p>

                  <div className="search-bottom-row">
                    <span className="search-price">
                      ₹{food.price}
                    </span>

                    <button className="order-btn">
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SearchPage;