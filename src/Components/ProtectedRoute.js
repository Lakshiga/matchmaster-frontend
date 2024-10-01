import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  if (role === "") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;