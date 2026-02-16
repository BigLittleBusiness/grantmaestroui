import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // return isLoggedIn ? children : <Navigate to="/login" />;

  return children;
};

export default PrivateRoute;