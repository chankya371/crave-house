import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaTags,
  FaUtensils,
  FaShoppingBag,
  FaTruck,
  FaSignOutAlt,
} from "react-icons/fa";

import logo from "../assets/logo.png";
import "../styles/AdminSidebar.css";

function AdminSidebar({ page, setPage }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img
          src={logo}
          alt="Crave House"
          className="sidebar-logo"
        />
      </div>

      <p className="menu-title">Management</p>

      <ul>
        <li
          className={page === "dashboard" ? "active" : ""}
          onClick={() => setPage("dashboard")}
        >
          <FaTachometerAlt />
          Dashboard
        </li>

        <li
          className={page === "users" ? "active" : ""}
          onClick={() => setPage("users")}
        >
          <FaUsers />
          Users
        </li>

        <li
          className={page === "categories" ? "active" : ""}
          onClick={() => setPage("categories")}
        >
          <FaTags />
          Categories
        </li>

        <li
          className={page === "food" ? "active" : ""}
          onClick={() => setPage("food")}
        >
          <FaUtensils />
          Food Menu
        </li>

        <li
          className={page === "orders" ? "active" : ""}
          onClick={() => setPage("orders")}
        >
          <FaShoppingBag />
          Orders
        </li>

        <li
          className={page === "orderStatus" ? "active" : ""}
          onClick={() => setPage("orderStatus")}
        >
          <FaTruck />
          Order Status
        </li>
      </ul>

      <div className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt />
        Logout
      </div>
    </div>
  );
}

export default AdminSidebar;