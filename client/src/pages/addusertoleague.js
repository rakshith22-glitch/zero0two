import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Select, MenuItem, Button, FormControl, InputLabel } from '@mui/material';

const AddUserToLeague = () => {
  const { leagueId } = useParams(); // Get leagueId from URL parameters
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    // Fetch users from the backend using Fetch API
    fetch('/api/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setUsers(data))
      .catch(error => console.error('Failed to fetch users:', error));
  }, []);

  const handleAddUser = () => {
    // Make an API call to add the selected user to the league using Fetch API
    fetch(`/api/leagues/${leagueId}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: selectedUserId }),
    })
    .then(response => {
      if (!response.ok) {
        // Convert non-2xx HTTP responses into errors:
        return response.json().then(data => Promise.reject(data));
      }
      return response.json();
    })
    .then(() => {
      alert('User added successfully');
      navigate(-1); // Go back to the previous page
    })
    .catch(error => console.error('Failed to add user to league:', error));
  };

  return (
    <div>
      <h2>Add User to League</h2>
      <FormControl fullWidth>
        <InputLabel id="user-select-label">Select User</InputLabel>
        <Select
          labelId="user-select-label"
          value={selectedUserId}
          label="Select User"
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          {users.map(user => (
            <MenuItem key={user._id} value={user._id}>
              {user.email} - {user.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleAddUser} 
        disabled={!selectedUserId}
        style={{ marginTop: '20px' }}
      >
        Add to League
      </Button>
    </div>
  );
};

export default AddUserToLeague;
