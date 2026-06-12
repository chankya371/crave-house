import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/api";
import { toast } from "react-toastify";
import "../styles/auth.css";

function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const email = state?.email;

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email not found. Please try again.");
      navigate("/forgot-password");
      return;
    }

    if (!otp || !newPassword) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // Verify OTP first
      await API.post("/auth/verify-otp", {
        email,
        otp,
      });

      // Reset password
      const res = await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      toast.success(
        res.data.message || "Password reset successful"
      );

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Invalid OTP"
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
            <h2>Reset Password</h2>

            <form onSubmit={handleResetPassword}>
              <div className="input-box">
                <label>OTP</label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <div className="input-box">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;