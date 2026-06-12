import React, { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/homeCSS/popularCategory.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaFire } from "react-icons/fa";

function PopularCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const res = await API.get("/category");


        let categoryData = [];

        if (Array.isArray(res.data)) {
          categoryData = res.data;
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          categoryData = res.data.data;
        }
        categoryData.forEach((cat) => {
  console.log("Name:", cat.name);
  console.log("Image:", cat.image);
});

        setCategories(categoryData.slice(0, 6));
      } catch (err) {
        toast.error("Failed to fetch categories");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    

    fetchCategories();

    
  }, []);

  return (
    <section className="popular-category-section">
      {/* HEADER */}
      <div className="popular-category-header">
        <div>
          <p className="popular-tag">
            <FaFire /> Crave House Picks
          </p>

          <h2 className="popular-section-title">
            Popular <span>Categories</span>
          </h2>
        </div>

        <button
          className="popular-view-btn"
          onClick={() => navigate("/categories")}
        >
          View All
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="popular-category-message">
          Loading delicious categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="popular-category-message">
          No categories found
        </div>
      ) : (
        <div className="popular-category-grid">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="popular-category-card"
              onClick={() => navigate(`/foodpage/${cat._id}`)}
            >
              <div className="popular-category-img-wrap">
                <img
                  src={
                    cat.image
                      ? cat.image.startsWith("http")
                        ? cat.image
                        : `http://localhost:5000${cat.image}`
                      : "https://via.placeholder.com/200"
                  }
                  alt={cat.name}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200";
                  }}
                />
              </div>

              <h4>{cat.name}</h4>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default PopularCategories;