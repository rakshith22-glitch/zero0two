import React from 'react';
import { checkSession } from '../utils/auth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, component: Component }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  React.useEffect(() => {
    const validateUserSession = async () => {
      try {
        const sessionData = await checkSession();
        if (sessionData && allowedRoles.includes(sessionData.role)) {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Error validating user session:', error);
      }
      setIsLoading(false);
    };

    validateUserSession();
  }, [allowedRoles]);

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthorized) {
    // Redirect to the login page if not authorized
    return <Navigate to="/login" />;
  }

  return <Component />;
};

export default ProtectedRoute;
