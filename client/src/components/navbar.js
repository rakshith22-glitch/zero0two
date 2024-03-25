import React from 'react';
import { Button, AppBar, Toolbar, Typography } from '@mui/material';
import { useUser } from './userContext'; // Ensure the import path is correct
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useUser(); // Assuming your context now provides a logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Use the logout function from the context
    navigate('/login'); // Navigate to the login page after logout
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        002
        </Typography>
        {user && (
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        )}
        {!user && (
          <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
