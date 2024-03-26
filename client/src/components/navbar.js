import React, { useState, useEffect } from 'react';
import { Button, AppBar, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   const checkSession = async () => {
  //     try {
  //       const sessionResponse = await fetch(`https://zero0two-1.onrender.com//api/checkSession`, {
  //         credentials: 'include', // Necessary for session cookies
  //       });

  //       if (!sessionResponse.ok) {
  //         throw new Error('Failed to fetch session data.');
  //       }

  //       const { isLoggedIn: sessionLoggedIn } = await sessionResponse.json();
  //       setIsLoggedIn(sessionLoggedIn);
  //     } catch (error) {
  //       console.error('Session check error:', error);
  //       setIsLoggedIn(false);
  //     }
  //   };

  //   checkSession();
  // }, []);

  const handleLogout = async () => {
    try {
      // Assuming logout is a server call
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', // Necessary for cookies
      });
      // After logging out, update state and navigate to login page
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          002
        </Typography>
        {isLoggedIn ? (
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        ) : (
          <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
