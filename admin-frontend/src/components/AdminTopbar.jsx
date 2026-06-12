import React from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import "../styles/Topbar.css";

function Topbar({ page }) {
  const pageData = {
    dashboard: {
      title: "Dashboard",
      subtitle: "Monitor restaurant performance",
    },
    users: {
      title: "Users",
      subtitle: "Manage customers",
    },
    categories: {
      title: "Categories",
      subtitle: "Manage food categories",
    },
    food: {
      title: "Food Menu",
      subtitle: "Manage menu items",
    },
    orders: {
      title: "Orders",
      subtitle: "Track customer orders",
    },
    orderStatus: {
      title: "Order Status",
      subtitle: "Monitor deliveries",
    },
  };

  const currentPage =
    pageData[page] || pageData.dashboard;

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1>{currentPage.title}</h1>
        <p>{currentPage.subtitle}</p>
      </div>

      <div className="topbar-right">
        <button className="notification-btn">
          <IoIosNotificationsOutline />
          <span className="badge">3</span>
        </button>

        <div className="admin-profile">
          <CgProfile />
          <div>
            <h4>Admin</h4>
            <p>Crave House</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;