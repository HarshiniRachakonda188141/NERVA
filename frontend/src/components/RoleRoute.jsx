import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function RoleRoute({
  children,
  allowedRoles = [],
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="role-loading-screen">
        <div className="role-loading-content">
          <div className="role-loading-pulse" />
          <p>Loading NERVA...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    if (user.role === "citizen") {
      return (
        <Navigate
          to="/citizen"
          replace
        />
      );
    }

    if (user.role === "field_team") {
      return (
        <Navigate
          to="/field"
          replace
        />
      );
    }

    if (user.role === "city_command") {
      return (
        <Navigate
          to="/pulse"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}