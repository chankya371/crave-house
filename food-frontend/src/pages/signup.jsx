import { useState } from "react";
import API from "../api/api";
import "../styles/auth.css";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import logoImage from "../assets/logo.png";
import foodImage from "../assets/login.png";

function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+91",
    mobile: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.mobile ||
      !form.email ||
      !form.password
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await API.post("/signup", form);
      toast.success("OTP sent to your email");
      setShowOtp(true);
    } catch {
      toast.error("Signup failed");
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    try {
      await API.post("/verify-otp", {
        email: form.email,
        otp,
      });

      toast.success("Account verified successfully");
      navigate("/login");
    } catch {
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-left">
          <div className="brand-box">
            <img src={logoImage} alt="Crave House Logo" className="brand-logo" />
            <h1>Crave House</h1>
          </div>

          <p>Hot • Fresh • Delivered Fast</p>

          <img src={foodImage} alt="food" className="food-image" />
        </div>

        <div className="login-right signup-right">
          <div className="login-card signup-card">
            <h2>{showOtp ? "Verify OTP" : "Join Us"}</h2>

            {!showOtp ? (
              <>
                <div className="signup-grid">
                  <div className="input-box">
                    <label>First Name</label>
                    <input
                      name="firstName"
                      placeholder="Enter first name"
                      value={form.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-box">
                    <label>Last Name</label>
                    <input
                      name="lastName"
                      placeholder="Enter last name"
                      value={form.lastName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-box">
                    <label>Country Code</label>
                    <input
                      name="countryCode"
                      placeholder="+91"
                      value={form.countryCode}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-box">
                    <label>Mobile Number</label>
                    <input
                      name="mobile"
                      placeholder="Enter mobile number"
                      value={form.mobile}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-box full-width">
                    <label>Email</label>
                    <input
                      name="email"
                      placeholder="Enter email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-box full-width">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Create password"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button onClick={handleSignup}>Create Account</button>
              </>
            ) : (
              <>
                <div className="input-box">
                  <label>Enter OTP</label>
                  <input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>

                <button onClick={verifyOtp}>Verify OTP</button>
              </>
            )}

            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;