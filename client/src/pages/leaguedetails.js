import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Card, CardContent, Grid, Container, CircularProgress } from '@mui/material';
import LeagueTeams from '../components/leagueteams';
import AddTeamToLeague from './addteamtoleague';
import AddPlayerToLeague from './addplayertoleague';

const DetailedLeaguePage = () => {
  const [leagueDetails, setLeagueDetails] = useState(null);
  const { leagueName } = useParams();

  useEffect(() => {
    const fetchLeagueDetailsByName = async () => {
      try {
        const response = await fetch(`/api/leagues`);
        if (response.ok) {
          const leagues = await response.json();
          // Loop through the leagues array
          leagues.forEach(league => {
            // Check if the leagueName matches the one from useParams
            if (league.leagueName === leagueName) {
              console.log('League Data:', league);
              setLeagueDetails(league);
            }
          });
        } else {
          console.error('Error fetching league details:', response.statusText);
        }
      } catch (error) {
        console.error('Fetch failed:', error);
      }
    };

    if (leagueName) {
      fetchLeagueDetailsByName();
    }
  }, [leagueName]);

  if (!leagueDetails) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Grid container spacing={8}>
        {/* League details card */}
        <Grid item xs={16} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent sx={{ padding: { xs: 2, sm: 3, md: 4 } }}>
              <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 'bold', color: '#0277bd', mb: 3 }}>
                {leagueDetails.leagueName}
              </Typography>
              <Grid container spacing={2}>
                {/* League details presented in a structured and spaced manner */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">Day of the Week: {leagueDetails.dayOfWeek}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">Time: {leagueDetails.time}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">Team Composition: {leagueDetails.teamComposition}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">Skill Level: {leagueDetails.skillLevel}</Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4 }}>
                {/* Render LeagueTeams component */}
                <LeagueTeams teams={leagueDetails.teams} />
              </Box>


            </CardContent>
          </Card>
        </Grid>

        {/* AddTeamToLeague component */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent sx={{ padding: { xs: 2, sm: 3, md: 4 } }}>
              {/* Render the AddTeamToLeague component */}
              <AddTeamToLeague />
            </CardContent>
          </Card>
        </Grid>

        {/* AddPlayerToLeague component */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent sx={{ padding: { xs: 2, sm: 3, md: 4 } }}>
              {/* Render the AddPlayerToLeague component */}
              <AddPlayerToLeague />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DetailedLeaguePage;
