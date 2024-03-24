import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to get the token from localStorage on initial load
    const token = localStorage.getItem('token');
    if (token) {
      // If a token is found, assume the user is logged in (you might want to validate it)
      // Optionally decode token here if it contains user details
      return { isLoggedIn: true }; // Placeholder, adjust as needed
    }
    return null; // No user logged in initially
  });

  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) return;

      try {
        const response = await fetch('/api/validateToken', {
          method: 'GET', // Assuming a GET request; adjust as needed
          headers: new Headers({
            'Authorization': `Bearer ${storedToken}`,
          }),
        });

        if (!response.ok) throw new Error('Token validation failed');
        
        const userData = await response.json();
        setUser({ ...userData, isLoggedIn: true });
      } catch (error) {
        console.error('Error validating token:', error);
        localStorage.removeItem('token');
        setUser(null); // Reset user state if token is invalid
      }
    };

    validateToken();
  }, []);

  const login = async (token, userData) => {
    localStorage.setItem('token', token); // Store the token for session management
    setUser({ ...userData, isLoggedIn: true }); // Update user state with login details
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove the stored token
    setUser(null); // Clear the user state
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
