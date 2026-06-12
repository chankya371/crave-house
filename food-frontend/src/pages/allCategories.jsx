import React, { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/homeCategory.css";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaSearch,
  FaTags,
} from "react-icons/fa";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] =
    useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await API.get("/category");

      let categoryData = [];

      if (Array.isArray(res.data)) {
        categoryData = res.data;
      } else if (
        res.data?.data &&
        Array.isArray(res.data.data)
      ) {
        categoryData = res.data.data;
      } else if (
        res.data?.categories &&
        Array.isArray(res.data.categories)
      ) {
        categoryData = res.data.categories;
      }

      setCategories(categoryData);
      setFilteredCategories(categoryData);
    } catch (err) {
      console.log(err);
      setCategories([]);
      setFilteredCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredCategories(filtered);
  }, [search, categories]);

  return (
    <div className="category-page">
      {/* HEADER */}
      <div className="category-header">
        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="header-center">
          <h1>Explore Categories</h1>
          <p>Find your favorite delicious foods</p>
        </div>

        <div className="category-count">
          <FaTags />
          <span>
            {filteredCategories.length} Categories
          </span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="category-search">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search category..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="loading-box">
          Loading categories...
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="empty-box">
          No categories found
        </div>
      ) : (
        <div className="category-grid">
          {filteredCategories.map((cat) => (
            <div
              key={cat._id}
              className="category-card"
              onClick={() =>
                navigate(`/foodpage/${cat._id}`)
              }
            >
              <div className="category-image-wrapper">
                <img
                  src={
                    cat.image
                      ? cat.image.startsWith("http")
                        ? cat.image
                        : `http://localhost:5000${cat.image}`
                      : "https://via.placeholder.com/300"
                  }
                  alt={cat.name}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300";
                  }}
                />
              </div>

              <div className="category-content">
                <h4>{cat.name}</h4>
                <p>Explore delicious items</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Categories;