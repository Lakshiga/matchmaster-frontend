import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, isVerified, role, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role === 'Organizer' && !isVerified) {
    return <Navigate to="/not-verified" />;
  }

  return children;
};

export default ProtectedRoute;
