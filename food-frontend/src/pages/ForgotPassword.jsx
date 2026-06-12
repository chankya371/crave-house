import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { toast } from "react-toastify";
import "../styles/auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/forgot-password", {
        email,
      });

      toast.success(
        res.data.message || "OTP sent successfully"
      );

      navigate("/reset-password", {
        state: { email },
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div
          className="login-right"
          style={{ width: "100%" }}
        >
          <div className="login-card">
            <h2>Forgot Password</h2>

            <p className="auth-subtitle">
              Enter your registered email address
            </p>

            <form onSubmit={handleSendOtp}>
              <div className="input-box">
                <label>Email</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Sending OTP..."
                  : "Send OTP"}
              </button>
            </form>

            <p style={{ marginTop: "15px" }}>
              <Link to="/login">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;