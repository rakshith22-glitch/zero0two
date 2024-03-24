import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../components/userContext'; // Ensure this import path matches your file structure

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useUser(); // Assuming your context provides a login function

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // If the server response is not ok, it means login failed.
        const { message } = await response.json();
        setErrorMsg(message || 'Failed to log in. Please check your credentials.');
        return;
      }

      const { token, user } = await response.json();
      // Use the login function from the context to update the global state
      login(token, user);

      console.log('Login successful');
      // Redirect based on user role
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('An error occurred during login.');
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Log In
        </Button>
        {errorMsg && <Alert severity="error">{errorMsg} <Link to="/signup"> click here to signup</Link> </Alert>
         }
      </Box>
    </Box>
  );
}

export default Login;
