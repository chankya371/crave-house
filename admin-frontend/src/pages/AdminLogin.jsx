import { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "../styles/adminLogin.css";

import logo from "../assets/logo.png"; // your Crave House logo

function AdminLogin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const user = jwtDecode(token);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      localStorage.removeItem("token");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const res = await API.post("/admin/login", {
        email: form.email.trim(),
        password: form.password.trim(),
      });

      localStorage.setItem("token", res.data.token);

      toast.success("Admin Login Successful");
      navigate("/admin");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Admin Login Failed"
      );
    }
  };

  return (
    <div className="admin-login-container">
      <div className="glow glow-left"></div>
      <div className="glow glow-right"></div>

      <div className="admin-login-card">
        <img
          src={logo}
          alt="Crave House"
          className="admin-logo"
        />

        <h1>Admin Portal</h1>

        <p>
          Sign in to manage foods, orders,
          customers and reports.
        </p>

        <div className="input-group">
          <input
            type="email"
            name="email"
            value={form.email}
            placeholder="Admin Email"
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            value={form.password}
            placeholder="Password"
            onChange={handleChange}
          />
        </div>

        <button
          className="login-btn"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;