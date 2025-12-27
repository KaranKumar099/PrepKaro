// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();

  if (!user) {
    // Not logged in → redirect to login/auth page
    return <Navigate to="/auth" replace />;
  }

  // Logged in → render the page
  return children;
};

export default ProtectedRoute;
