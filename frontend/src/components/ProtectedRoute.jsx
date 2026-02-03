import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/UseUserStore";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUserStore();

  if (loading) return <p>Checking auth...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute