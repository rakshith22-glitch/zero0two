import React, { useState } from 'react';
import { Card, Box, TextField, Button, Typography, Alert } from '@mui/material';
import {  useNavigate } from 'react-router-dom';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Perform the login request
      const loginResponse = await fetch(`https://zero0two-1.onrender.com/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Necessary for session cookies
      });

      if (!loginResponse.ok) {
        const { message } = await loginResponse.json();
        setErrorMsg(message || 'Failed to log in. Please check your credentials.');
        return;
      }

      // After a successful login, fetch session data including user role
      const sessionResponse = await fetch(`https://zero0two-1.onrender.com/api/session`, {
        credentials: 'include', // Necessary for session cookies
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to fetch session data.');
      }

      const { isLoggedIn, user } = await sessionResponse.json();

      if (isLoggedIn) {
        console.log('Session data:', user);

        // Redirect based on user role
        // navigate(user.role === 'admin' ? '/admin' : '/');
      } else {
        // Handle case where session check says not logged in
        setErrorMsg('Failed to establish a session. Please try logging in again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg(error.message || 'An error occurred during login.');
    }
  };
  return (

    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '8px', // Ensures consistency in design
      }}
    >

      <Card
        sx={{
          width: '100%', // Ensures the card extends to fit the container
          maxWidth: '500px', // Matches the "Signup" form width for consistency
          padding: '20px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Subtle shadow for depth
          borderRadius: '8px', // Rounded corners for a softer look
          backgroundColor: '#ffffff', // Bright background to stand out
          display: 'flex', // Creates a flex container
          flexDirection: 'column', // Organizes children in a vertical column
          alignItems: 'center',
        }}
      >
        <Typography

          variant="h5"
          sx={{
            color: '#0277bd', // Dark blue for contrast and readability
            marginBottom: '20px', // Space below the title for breathing room
          }}
        >
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, maxWidth: 360 }}>
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
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#29b6f6', // Styling to match the "Signup" form
                },
                '&:hover fieldset': {
                  borderColor: '#0288d1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0277bd',
                },
              },
            }}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#29b6f6',
                },
                '&:hover fieldset': {
                  borderColor: '#0288d1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0277bd',
                },
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: '#66bb6a', // A vibrant green, matching the "Signup" button
              '&:hover': {
                backgroundColor: '#388e3c',
              },
            }}
          >
            Log In
          </Button>
          {errorMsg && (
            <Alert
              severity="error"
              sx={{
                mt: 2, // Consistent spacing as in "Signup"
              }}
            >
              {errorMsg}
            </Alert>
          )}
        </Box>
        <Alert onClick={() => navigate('/signup')} severity="info" sx={{
          width: '100%', mt: 2, justifyContent: "center", ':hover': {
            cursor: 'pointer', // Changes the cursor to a pointer on hover
          },
        }}>click here to SingUp</Alert>
      </Card>

    </Box>

  );
}

export default Login;
