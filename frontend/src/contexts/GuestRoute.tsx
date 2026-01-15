import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { JSX } from "react/jsx-runtime";

export default function GuestRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  return children;
}
