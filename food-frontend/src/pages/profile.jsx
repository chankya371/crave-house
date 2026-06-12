import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  ShoppingBag,
  Heart,
  MapPinned,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/profile.css";
import OrdersTab from "../profileComponent/OrdersTab";
import Favourites from "../profileComponent/Favourites";
import AddressTab from "../profileComponent/AddressTab";
import SettingsTab from "../profileComponent/SettingsTab";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    countryCode: "",
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await API.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.user);
    } catch (err) {
      console.log(err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="profile-loading">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* TOP HEADER */}
      <div className="profile-header">
        <div>
          <h1>
            {user.firstName} {user.lastName}
          </h1>

          <p>
            {user.countryCode} {user.mobile} • {user.email}
          </p>
        </div>

        <button
          className="edit-btn"
          onClick={() => navigate("/edit-account")}
        >
          EDIT PROFILE
        </button>
      </div>

      {/* MAIN SECTION */}
      <div className="profile-dashboard">
        {/* LEFT SIDEBAR */}
        <div className="profile-sidebar">
          <div
            className={`sidebar-item ${
              activeTab === "orders" ? "active" : ""
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingBag size={18} />
            <span>Orders</span>
          </div>

          <div
            className={`sidebar-item ${
              activeTab === "favourites" ? "active" : ""
            }`}
            onClick={() => setActiveTab("favourites")}
          >
            <Heart size={18} />
            <span>Favourites</span>
          </div>

          <div
            className={`sidebar-item ${
              activeTab === "address" ? "active" : ""
            }`}
            onClick={() => setActiveTab("address")}
          >
            <MapPinned size={18} />
            <span>Addresses</span>
          </div>

          <div
            className={`sidebar-item ${
              activeTab === "settings" ? "active" : ""
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={18} />
            <span>Settings</span>
          </div>

          <div
            className={`sidebar-item ${
              activeTab === "help" ? "active" : ""
            }`}
            onClick={() => setActiveTab("help")}
          >
            <HelpCircle size={18} />
            <span>Help</span>
          </div>

          <div
            className="sidebar-item logout"
            onClick={logout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="profile-content">
          {activeTab === "orders" && <OrdersTab />}

          {activeTab === "favourites" && <Favourites />}

          {activeTab === "address" && <AddressTab />}

          {activeTab === "settings" && <SettingsTab />}

          {activeTab === "help" && (
            <>
              <h2>Help Center</h2>
              <div className="content-box">
                <p>FAQs and support links.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;