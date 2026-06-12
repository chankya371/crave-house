import {
  FaUser,
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

import "../styles/homeCSS/navbar.css";

import {
  useState,
  useEffect,
  useCallback,
} from "react";

import { useNavigate } from "react-router-dom";

import API from "../api/api";

import logo from "../assets/logo.png";

function Navbar() {
  const [search, setSearch] = useState("");

  const [foods, setFoods] = useState([]);

  const [suggestions, setSuggestions] =
    useState([]);

  const [cartCount, setCartCount] =
    useState(0);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  /* FETCH FOODS */

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await API.get(
          "/food?limit=100"
        );

        setFoods(res.data?.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFoods();
  }, []);

  /* CART COUNT */

  const fetchCartCount = useCallback(async () => {
    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const res = await API.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const total = res.data.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCartCount(total);
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  useEffect(() => {
    fetchCartCount();

    window.addEventListener(
      "cartUpdated",
      fetchCartCount
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        fetchCartCount
      );
    };
  }, [fetchCartCount]);

  /* SEARCH SUGGESTIONS */

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = foods.filter((food) =>
      food.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 6));
  }, [search, foods]);

  /* HANDLE SEARCH */

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/search/${search}`);

      setSuggestions([]);

      setSearch("");

      setMenuOpen(false);
    }
  };

  /* LOGOUT */

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* LOGO */}

      <div
        className="nav-left"
        onClick={() => navigate("/")}
      >
        <img
          src={logo}
          alt="Crave House"
          className="logo-img"
        />
      </div>

      {/* SEARCH */}

      <div className="search-wrapper">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search burgers, pizza, fries..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === "Enter" &&
              handleSearch()
            }
          />

          {/* RIGHT ICON */}

          <div
            className="search-icon-box"
            onClick={handleSearch}
          >
            <FaSearch className="search-icon" />
          </div>
        </div>

        {/* SUGGESTIONS */}

        {suggestions.length > 0 && (
          <div className="suggestion-box">
            {suggestions.map((food) => (
              <div
                key={food._id}
                className="suggestion-item"
                onClick={() => {
                  navigate(
                    `/search/${food.name}`
                  );

                  setSearch("");

                  setSuggestions([]);
                }}
              >
                {food.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MOBILE MENU */}

      <div
        className="mobile-menu-icon"
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
      >
        {menuOpen ? (
          <FaTimes />
        ) : (
          <FaBars />
        )}
      </div>

      {/* RIGHT */}

      <div
        className={`nav-right ${
          menuOpen ? "active" : ""
        }`}
      >
        <p onClick={() => navigate("/")}>
          Home
        </p>

        <p
          onClick={() =>
            navigate("/categories")
          }
        >
          Menu
        </p>

        {/* PROFILE */}

        <div
          className="nav-icon"
          onClick={() =>
            navigate("/profile")
          }
        >
          <FaUser />
        </div>

        {/* CART */}

        <div
          className="cart-icon-wrapper"
          onClick={() => navigate("/cart")}
        >
          <FaShoppingCart />

          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount}
            </span>
          )}
        </div>

        {/* LOGOUT */}

        {token && (
          <div
            className="nav-icon logout-icon"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;