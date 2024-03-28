import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Select, MenuItem, Button, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';

const AddTeamToLeague = () => {
  const { leagueName } = useParams(); // Get leagueName from URL parameters
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [selectedTeamName, setSelectedTeamName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to hold error message
  const [success, setSuccess] = useState(null); // State to hold success message

  useEffect(() => {
    // Fetch teams from the backend using Fetch API
    fetch(`/api/teams`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }
        return response.json();
      })
      .then(data => {
        setTeams(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch teams:', error);
        setError('Failed to fetch teams. Please try again later.'); // Update error state
        setLoading(false); // Stop loading indicator
      });
  }, []);

  const handleAddTeam = () => {
    if (!selectedTeamName) {
      alert('Please select a team.');
      return;
    }

    // Find the teamId by teamName
    const selectedTeam = teams.find(team => team.name === selectedTeamName);
    if (!selectedTeam) {
      alert('Selected team not found.');
      return;
    }

    // Make an API call to add the selected team to the selected league using Fetch API
    fetch(`/api/leagues/${encodeURIComponent(leagueName)}/add-team`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ teamName: selectedTeamName }), // Send teamName instead of teamId
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => Promise.reject(data));
        }
        return response.json();
      })
      .then(() => {
        setSuccess('Team added successfully'); // Update success state
        navigate(-1); // Go back to the previous page
      })
      .catch(error => {
        console.error('Failed to add team to league:', error);
        setError('Failed to add team to league. Please try again later.'); // Update error state
      });
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      {error && <Alert severity="error">{error}</Alert>} {/* Display error message if error state is not null */}
      {success && <Alert severity="success">{success}</Alert>} {/* Display success message if success state is not null */}
      <h2>Add Team to League</h2>
      <FormControl fullWidth>
        <InputLabel id="team-select-label">Select Team</InputLabel>
        <Select
          labelId="team-select-label"
          value={selectedTeamName}
          label="Select Team"
          onChange={(e) => setSelectedTeamName(e.target.value)}
        >
          {teams.map(team => (
            <MenuItem key={team._id} value={team.name}>
              {team.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddTeam}
        disabled={!selectedTeamName}
        style={{ marginTop: '20px' }}
      >
        Add to League
      </Button>
    </div>
  );
};

export default AddTeamToLeague;
