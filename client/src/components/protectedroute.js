// src/components/ProtectedRoute.js
import React from 'react';
import { checkSession } from '../utils/auth';

const ProtectedRoute = ({ allowedRoles, component: Component }) => {

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const validateUserSession = async () => {
      const sessionData = await checkSession();
      if (sessionData && allowedRoles.includes(sessionData.role)) {

      }
      setIsLoading(false);
    };

    validateUserSession();
  }, [allowedRoles]);

  if (isLoading) return <div>Loading...</div>;

  return <Component />;
};

export default ProtectedRoute