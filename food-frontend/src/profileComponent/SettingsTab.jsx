import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import "../styles/profileComponentCSs/settingsTab.css";

function SettingsTab() {
  const [recommendations, setRecommendations] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRecommendations(res.data.recommendations);
    } catch (error) {
      toast.error("Failed to load settings");
    }
  };

  const handleToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      const newValue = !recommendations;

      setRecommendations(newValue);

      await API.put(
        "/settings/notifications",
        {
          recommendations: newValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Settings updated");
    } catch (error) {
      toast.error("Update failed");
      setRecommendations(!recommendations);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await API.delete("/user/delete-account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("token");
      toast.success("Account deleted successfully");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-tab">
      <h2>Settings</h2>

      <div className="settings-card">
        {/* SMS Preferences */}
        <div className="settings-section-title">SMS PREFERENCES</div>

        <div className="settings-row">
          <p className="settings-text">
            Order related SMS cannot be disabled as they are critical to provide
            service
          </p>
        </div>

        {/* Notifications */}
        <div className="settings-section-title">NOTIFICATIONS</div>

        <div className="settings-row toggle-row">
          <div>
            <h4>Recommendations & Reminders</h4>
            <p className="settings-text">
              Keep this on to receive offer recommendations & timely reminders
              based on your interests
            </p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={recommendations}
              onChange={handleToggle}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Delete */}
        <div className="settings-section-title">ACCOUNT DELETION</div>

        <div className="settings-row">
          <button
            className="delete-btn"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsTab;