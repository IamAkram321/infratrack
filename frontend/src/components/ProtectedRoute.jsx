import { Navigate } from "react-router-dom";
import { getToken, getRole } from "../utils/auth";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = getToken();
  const role = getRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
