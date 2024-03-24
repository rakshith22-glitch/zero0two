import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardActions, Typography, Grid, Box, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

const LeaguesPage = ({ role }) => {
  const [leagues, setLeagues] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState({});
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // Can be 'error', 'warning', 'info', or 'success'
  });

  useEffect(() => {
    const fetchLeaguesAndPlayers = async () => {
      await fetchLeagues();
      await fetchPlayers();
    };
    fetchLeaguesAndPlayers();
  }, [role, leagues, players]);

  const fetchLeagues = async () => {
    try {
      const response = await fetch('/api/leagues');
      const data = await response.json();
      setLeagues(data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    }
  };

  const fetchPlayers = async () => {
    if (role === 'admin') {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    }
  };

  const handleAddPlayer = async (leagueId) => {
    const player = selectedPlayers[leagueId];
    if (!player) return;

    try {
      const response = await fetch(`/api/leagues/${leagueId}/add-player`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: player._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Player already exists in league") {
          setSnackbar({ open: true, message: 'Player already exists in this league.', severity: 'warning' });
        } else {
          throw new Error(data.message || 'Failed to add player');
        }
      } else {
        setSnackbar({ open: true, message: 'Player added successfully', severity: 'success' });

        setPlayers(players.filter(p => p._id !== player._id));
        setSelectedPlayers(prev => ({ ...prev, [leagueId]: null }));
      }
    } catch (error) {
      console.error(`Failed to add player to league: ${leagueId}`, error.message || error);
      setSnackbar({ open: true, message: error.message || 'An error occurred while adding the player.', severity: 'error' });
    }
  };


  const handleChangePlayer = (leagueId, player) => {
    setSelectedPlayers(prev => ({ ...prev, [leagueId]: player }));
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" gutterBottom>Leagues</Typography>
      <Grid container spacing={4} justifyContent="center">
        {leagues.map(league => (
          <Grid item xs={12} sm={6} md={4} key={league._id}>
            <Card sx={{ maxWidth: 345, mb: 2, position: 'relative' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate(`/leagues/${league.leagueName}`)}
                sx={{ position: 'absolute', top: 16, right: 16 }}
              >
                View League
              </Button>
              <CardContent>
                <Typography variant="h5" gutterBottom>{league.leagueName}</Typography>
                <Typography variant="body2" color="textSecondary">Day: {league.dayOfWeek}</Typography>
                <Typography variant="body2" color="textSecondary">Time: {league.time}</Typography>
                <Typography variant="body2" color="textSecondary">Composition: {league.teamComposition}</Typography>
                <Typography variant="body2" color="textSecondary">Skill: {league.skillLevel}</Typography>
              </CardContent>
              {role === 'admin' && (
                <CardActions>
                  <Autocomplete
                    id="player-autocomplete"
                    options={players}
                    getOptionLabel={(option) => `${option.firstname} ${option.lastname}`}
                    onChange={(event, player) => handleChangePlayer(league._id, player)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Add Player"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    )}
                    value={selectedPlayers[league._id] || null}
                    sx={{ m: 1, width: '100%' }}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleAddPlayer(league._id)}
                    disabled={!selectedPlayers[league._id]}
                    sx={{ m: 1 }}
                  >
                    Add
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeaguesPage;
