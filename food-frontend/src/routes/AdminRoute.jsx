import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  // ❌ not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  const user = jwtDecode(token);

  // ❌ not admin
  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  // ✅ admin allowed
  return children;
}

export default AdminRoute;