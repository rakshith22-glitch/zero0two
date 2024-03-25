import React, { useState } from 'react';
import { Card, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
function Signup() {
  const [email, setEmail] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [duprRating, setDuprRating] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [errorMessage, setErrorMessage] = useState(''); // State to hold error message
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message on new submission
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname, lastname, email, password, role, duprRating }),
    });
    if (response.ok) {
      console.log('Signup successful');
      navigate('/login')
    } else {
      const result = await response.json();
      console.error('Signup failed');
      setErrorMessage(result.message || 'Failed to sign up.'); // Use the server response or a default message
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
        borderRadius: '8px', // Smoothed corners
      }}
    >

      <Typography
        component="h1"
        variant="h5"
        sx={{
          color: '#0277bd', // Dark blue for text for contrast
          marginBottom: '20px', // Space below the title
        }}
      >
        Sign Up
      </Typography>
      <Card
        sx={{
          width: '100%', // Makes the card extend to fit the box
          maxWidth: '500px', // Ensures the card isn't too wide on larger screens
          padding: '20px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Adds a subtle shadow for depth
          borderRadius: '8px', // Consistent rounded corners
          backgroundColor: '#ffffff', // Ensures the card stands out against the box
          display: 'flex', // Creates a flex container
          flexDirection: 'column', // Organizes children in a vertical column
          alignItems: 'center', // Center-aligns items horizontally within the card
        }}
      >
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%', maxWidth: 360 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="fname"
            autoFocus
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#29b6f6', // Same light blue for a consistent look
                },
                '&:hover fieldset': {
                  borderColor: '#0288d1', // Darker on hover for interaction feedback
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0277bd', // Focused state
                },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="lname"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#29b6f6', // Same light blue for a consistent look
                },
                '&:hover fieldset': {
                  borderColor: '#0288d1', // Darker on hover for interaction feedback
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0277bd', // Focused state
                },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
          
            label="DUPR Rating" // Label changed to reflect DUPR rating
            name="duprRating" // Name changed to duprRating
            type="number" // Changed to type number for numeric input
            autoComplete="off" // Changed as autoComplete doesn't apply here
            autoFocus
            value={duprRating} // Assuming you have a corresponding state variable for DUPR rating
            onChange={(e) => setDuprRating(e.target.value)} // Adjust the setter function accordingly
            InputProps={{ // Added InputProps to restrict the decimal places
              inputProps: {
                min: 1, // Assuming DUPR rating minimum is 1
                max: 8, // Assuming DUPR rating maximum is 8
                step: 0.1 // Allows for decimal ratings
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#29b6f6', // Light blue for a consistent look
                },
                '&:hover fieldset': {
                  borderColor: '#0288d1', // Darker blue on hover for interaction feedback
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0277bd', // Focused state
                },
              },
            }}
          />

          <TextField
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
                  borderColor: '#29b6f6', // Same light blue for a consistent look
                },
                '&:hover fieldset': {
                  borderColor: '#0288d1', // Darker on hover for interaction feedback
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0277bd', // Focused state
                },
              },
            }}
          />
          <TextField
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
                  borderColor: '#29b6f6', // Same light blue for a consistent look
                },
                '&:hover fieldset': {
                  borderColor: '#0288d1', // Darker on hover for interaction feedback
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0277bd', // Focused state
                },
              },
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
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
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin" disabled>Admin</MenuItem> {/* Keep Admin disabled for security */}
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: '#66bb6a', // Consistent button color
              '&:hover': {
                backgroundColor: '#388e3c', // Darker on hover
              },
            }}
          >
            Sign Up
          </Button>
          {errorMessage && <Alert onClick={() => navigate('/login')} severity="error" sx={{ width: '100%', mt: 2 }}>{errorMessage} click here to login</Alert>}
        </Box>
      </Card>
    </Box>

  );
}

export default Signup;
