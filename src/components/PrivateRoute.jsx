import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';

export default function PrivateRoute({ children, currentUserUSN, currentUserEmail, role }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    alert("Kindly login first.");
    return <Navigate to="/login" />;
  }

  // Pass props to child component if logged in
  return currentUser
    ? React.cloneElement(children, {
        currentUserUSN,
        currentUserEmail,
        role
      })
    : notLogged();
}
