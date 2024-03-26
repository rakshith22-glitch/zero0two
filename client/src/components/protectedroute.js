// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { checkSession } from '../utils/auth';

const ProtectedRoute = ({ allowedRoles, component: Component }) => {
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const validateUserSession = async () => {
      const sessionData = await checkSession();
      if (sessionData && allowedRoles.includes(sessionData.role)) {
        setUser(sessionData);
      }
      setIsLoading(false);
    };

    validateUserSession();
  }, [allowedRoles]);

  if (isLoading) return <div>Loading...</div>;

  return <Component />;
};

export default ProtectedRoute