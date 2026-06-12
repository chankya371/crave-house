import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import logoImage from "../assets/logo.png";
import foodImage from "../assets/login.png";
import "../styles/auth.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await API.post("/login", form);

      localStorage.setItem("token", res.data.token);

      const user = jwtDecode(res.data.token);

      toast.success("Login successful");

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch {
      toast.error("Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-left">
          <div className="brand-box">
            <img
              src={logoImage}
              alt="Crave House Logo"
              className="brand-logo"
            />
            <h1>Crave House</h1>
          </div>

          <p>Hot • Fresh • Delivered Fast</p>

          <img
            src={foodImage}
            alt="food"
            className="food-image"
          />
        </div>

        <div className="login-right">
          <div className="login-card">
            <h2>Login</h2>

            <div className="input-box">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleLogin()
                }
              />

              <div className="forgot-password">
                <Link to="/forgot-password">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button onClick={handleLogin}>
              Sign In
            </button>

            <p>
              Don't have an account?{" "}
              <Link to="/signup">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;