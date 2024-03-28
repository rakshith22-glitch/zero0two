import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Select, MenuItem, Button, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';

const AddPlayerToLeague = () => {
  const { leagueName } = useParams(); // Get leagueName from URL parameters
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to hold error message
  const [success, setSuccess] = useState(null); // State to hold success message

  useEffect(() => {
    // Fetch players from the backend using Fetch API
    fetch(`/api/users`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch players');
        }
        return response.json();
      })
      .then(data => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch players:', error);
        setError('Failed to fetch players. Please try again later.'); // Update error state
        setLoading(false); // Stop loading indicator
      });
  }, []);

  const handleAddPlayer = () => {
    if (!selectedPlayerId) {
      alert('Please select a player.');
      return;
    }

    // Make an API call to add the selected player to the selected league using Fetch API
    fetch(`/api/leagues/${encodeURIComponent(leagueName)}/add-player`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ playerId: selectedPlayerId }), // Send playerId
    })
      .then(async response => {
        if (!response.ok) {
          const data = await response.json();
            return await Promise.reject(data);
        }
        return response.json();
      })
      .then(() => {
        setSuccess('Player added successfully'); // Update success state
        navigate(-1); // Go back to the previous page
      })
      .catch(error => {
        console.error('Failed to add player to league:', error);
        setError('Failed to add player to league. Please try again later.'); 
        console.log(selectedPlayerId)// Update error state
      });
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      {error && <Alert severity="error">{error}</Alert>} {/* Display error message if error state is not null */}
      {success && <Alert severity="success">{success}</Alert>} {/* Display success message if success state is not null */}
      <h2>Add Player to League</h2>
      <FormControl fullWidth>
        <InputLabel id="player-select-label">Select Player</InputLabel>
        <Select
          labelId="player-select-label"
          value={selectedPlayerId}
          label="Select Player"
          onChange={(e) => setSelectedPlayerId(e.target.value)}
        >
          {players.map(player => (
            <MenuItem key={player._id} value={player._id}>
              {player.firstname} {player.lastname}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddPlayer}
        disabled={!selectedPlayerId}
        style={{ marginTop: '20px' }}
      >
        Add to League
      </Button>
    </div>
  );
};

export default AddPlayerToLeague;
