import React, { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    role: "",
    createdAt: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/me");

      setUser(res.data.user);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="profile-page">
      <div className="profile-card">

        <div className="profile-avatar">
          {user.firstName?.charAt(0)}
        </div>

        <h2>
          {user.firstName} {user.lastName}
        </h2>

        <p className="role">{user.role}</p>

        <div className="profile-info">

          <div className="info-box">
            <label>First Name</label>
            <span>{user.firstName}</span>
          </div>

          <div className="info-box">
            <label>Last Name</label>
            <span>{user.lastName}</span>
          </div>

          <div className="info-box">
            <label>Email</label>
            <span>{user.email}</span>
          </div>

          <div className="info-box">
            <label>Phone</label>
            <span>{user.mobile}</span>
          </div>

          <div className="info-box">
            <label>Role</label>
            <span>{user.role}</span>
          </div>

          <div className="info-box">
            <label>Joined On</label>
            <span>
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>

        </div>

        <button className="edit-btn">
          Edit Profile
        </button>

      </div>
    </div>
  );
}

export default Profile;