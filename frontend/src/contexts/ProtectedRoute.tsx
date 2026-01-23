import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { JSX } from "react/jsx-runtime";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, loading } = useAuth();

  if (loading) return null; // atau spinner
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
