import { useContext, type ReactNode } from "react";
import { Context } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

interface UnprotectedRouteProps {
  children: ReactNode;
}

const UnprotectedRoute = ({ children }: UnprotectedRouteProps) => {
  const { user} = useContext(Context);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default UnprotectedRoute;
