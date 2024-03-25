import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardActions, Typography, Grid, Box, TextField, Snackbar, Alert } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';

const LeaguesPage = ({ role }) => {
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState({});
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // Can be 'error', 'warning', 'info', or 'success'
  });

  useEffect(() => {
    const fetchLeaguesAndTeams = async () => {
      await fetchLeagues();
      if (role === 'admin') {
        await fetchTeams();
      }
    };
    fetchLeaguesAndTeams();
  }, [role]);

  const fetchLeagues = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/leagues`);
      const data = await response.json();
      setLeagues(data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/teams`);
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };
  console.log(teams)
  const handleAddTeam = async (leagueId) => {
    const team = selectedTeams[leagueId];
    if (!team) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/leagues/${leagueId}/add-team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: team._id }),
      });

      if (!response.ok) {
        throw new Error('Failed to add team');
      }

      const message = 'Team added successfully';
      setSnackbar({ open: true, message, severity: 'success' });
      setSelectedTeams(prev => ({ ...prev, [leagueId]: null })); // Reset selection

      // Optionally refresh league or teams data here
    } catch (error) {
      console.error('Failed to add team to league:', error);
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    }
  };

  const handleChangeTeam = (leagueId, team) => {
    setSelectedTeams(prev => ({ ...prev, [leagueId]: team }));
  };

  return (
    <Box sx={{
      flexGrow: 1,
      padding: 3,
      marginTop: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#0277bd', marginBottom: '20px' }}>Leagues</Typography>
      <Grid container spacing={5} justifyContent="center">
        {leagues.map((league) => (
          <Grid item xs={12} sm={6} md={4} key={league._id}>
            <Card
              sx={{
                width: '100%',
                maxWidth: '500px',
                mb: 2,
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate(`/leagues/${league.leagueName}`)}
                sx={{
                 
                 
                  borderColor: '#66bb6a',
                  color: '#66bb6a',
                  '&:hover': {
                    backgroundColor: '#388e3c',
                    borderColor: '#388e3c',
                    color: '#fff',
                  },
                }}
              >
                View League
              </Button>
              <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#0277bd' }}>
                  {league.leagueName}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
                  Day: {league.dayOfWeek}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
                  Time: {league.time}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
                  Composition: {league.teamComposition}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
                  Skill: {league.skillLevel}
                </Typography>
              </CardContent>
              {role === 'admin' && (
                <CardActions sx={{ justifyContent: 'center', width: '100%' }}>
                  <Autocomplete
                    id="team-autocomplete"
                    options={teams}
                    getOptionLabel={(option) => option.name} // Assuming each team object has a 'name' property
                    onChange={(event, team) => handleChangeTeam(league._id, team)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Add Team"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    )}
                    value={selectedTeams[league._id] || null}
                    sx={{ m: 1, minWidth: '250px' }}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddTeam(league._id)}
                    disabled={!selectedTeams[league._id]}
                    sx={{
                      m: 1,
                      backgroundColor: '#66bb6a',
                      '&:hover': {
                        backgroundColor: '#388e3c',
                      },
                    }}
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
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeaguesPage;
