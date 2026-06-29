import React, { useEffect, useRef, useState } from "react";
import API from "../api/api";

import { IoIosNotificationsOutline } from "react-icons/io";
import {
  CgProfile,
  CgLogOut,
  CgPassword,
} from "react-icons/cg";

import {
  FaUserCircle,
  FaStore,
  FaCog,
  FaHistory,
} from "react-icons/fa";

import "../styles/Topbar.css";

function Topbar({ page, setPage }) {
  const [showProfile, setShowProfile] = useState(false);

  const [admin, setAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const profileRef = useRef(null);

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
    profile: {
      title: "My Profile",
      subtitle: "Manage your account",
    },
    restaurant: {
      title: "Restaurant",
      subtitle: "Restaurant information",
    },
    settings: {
      title: "Settings",
      subtitle: "Application settings",
    },
    activity: {
      title: "Activity Log",
      subtitle: "Recent admin activities",
    },
    changePassword: {
      title: "Change Password",
      subtitle: "Update your password",
    },
  };

  const currentPage = pageData[page] || pageData.dashboard;

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await API.get("/auth/me");

        setAdmin(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAdmin();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const openPage = (pageName) => {
    setPage(pageName);
    setShowProfile(false);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/admin-login";
  };

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

        <div
          className="profile-wrapper"
          ref={profileRef}
        >
          <div
            className="admin-profile"
            onClick={() =>
              setShowProfile(!showProfile)
            }
          >
            <CgProfile />

            <div>
              <h4>
                {admin.firstName} {admin.lastName}
              </h4>

              <p>{admin.email}</p>
            </div>
          </div>

          {showProfile && (
            <div className="profile-dropdown">

              <div className="profile-header">
                <CgProfile className="profile-icon" />

                <div>
                  <h4>
                    {admin.firstName} {admin.lastName}
                  </h4>

                  <p>{admin.email}</p>
                </div>
              </div>

              <div className="dropdown-divider"></div>

              <button
                className="dropdown-item"
                onClick={() => openPage("profile")}
              >
                <FaUserCircle />
                My Profile
              </button>

              <button
                className="dropdown-item"
                onClick={() => openPage("restaurant")}
              >
                <FaStore />
                Restaurant Info
              </button>

              <button
                className="dropdown-item"
                onClick={() => openPage("settings")}
              >
                <FaCog />
                Settings
              </button>

              <button
                className="dropdown-item"
                onClick={() => openPage("activity")}
              >
                <FaHistory />
                Activity Log
              </button>

              <button
                className="dropdown-item"
                onClick={() => openPage("changePassword")}
              >
                <CgPassword />
                Change Password
              </button>

              <div className="dropdown-divider"></div>

              <button
                className="dropdown-item logout"
                onClick={logout}
              >
                <CgLogOut />
                Logout
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Topbar;