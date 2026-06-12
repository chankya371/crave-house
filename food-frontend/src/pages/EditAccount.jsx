import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/profileComponentCSs/editAccount.css";
import { toast } from "react-toastify";

function EditAccount() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    countryCode: "",
  });

  const [editField, setEditField] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
      } catch (err) {
        toast.error("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e, field) => {
    setUser({
      ...user,
      [field]: e.target.value,
    });
  };

  const cancelEdit = () => {
    setEditField("");
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.put("/auth/update-profile", user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profile updated successfully");
      setEditField("");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="edit-account-page">
      {/* HEADER */}
      <div className="edit-account-header">
        <button
          className="back-button"
          onClick={() => navigate("/profile")}
        >
          <ArrowLeft size={28} />
        </button>

        <h2>Edit Account</h2>
      </div>

      {/* NAME */}
      <div className="edit-card">
        <span className="label">NAME</span>

        <div className="card-content">
          {editField === "name" ? (
            <input
              type="text"
              value={`${user.firstName} ${user.lastName}`}
              onChange={(e) => {
                const names = e.target.value.split(" ");
                setUser({
                  ...user,
                  firstName: names[0] || "",
                  lastName: names.slice(1).join(" "),
                });
              }}
              className="edit-input"
            />
          ) : (
            <p>
              {user.firstName} {user.lastName}
            </p>
          )}

          {editField !== "name" && (
            <button
              className="edit-text-btn"
              onClick={() => setEditField("name")}
            >
              EDIT
            </button>
          )}
        </div>

        {editField === "name" && (
          <div className="action-buttons">
            <button
              className="update-btn"
              onClick={updateProfile}
            >
              Update
            </button>

            <button
              className="cancel-btn"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* EMAIL */}
      <div className="edit-card">
        <span className="label">EMAIL ADDRESS</span>

        <div className="card-content">
          {editField === "email" ? (
            <input
              type="email"
              value={user.email}
              onChange={(e) =>
                handleChange(e, "email")
              }
              className="edit-input"
            />
          ) : (
            <p>{user.email}</p>
          )}

          {editField !== "email" && (
            <button
              className="edit-text-btn"
              onClick={() => setEditField("email")}
            >
              EDIT
            </button>
          )}
        </div>

        {editField === "email" && (
          <div className="action-buttons">
            <button
              className="update-btn"
              onClick={updateProfile}
            >
              Update
            </button>

            <button
              className="cancel-btn"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* PHONE */}
      <div className="edit-card">
        <span className="label">PHONE NUMBER</span>

        <div className="card-content">
          {editField === "mobile" ? (
            <input
              type="text"
              value={user.mobile}
              onChange={(e) =>
                handleChange(e, "mobile")
              }
              className="edit-input"
            />
          ) : (
            <p>
              {user.countryCode}
              <span className="phone-separator"> | </span>
              {user.mobile}
            </p>
          )}

          {editField !== "mobile" && (
            <button
              className="edit-text-btn"
              onClick={() => setEditField("mobile")}
            >
              EDIT
            </button>
          )}
        </div>

        {editField === "mobile" && (
          <div className="action-buttons">
            <button
              className="update-btn"
              onClick={updateProfile}
            >
              Update
            </button>

            <button
              className="cancel-btn"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditAccount;