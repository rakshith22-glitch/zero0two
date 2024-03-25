import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Card, CardContent, Grid, Container, CircularProgress } from '@mui/material';
import LeagueTeams from '../components/leagueteams'; // Adjust the import path as necessary

const DetailedLeaguePage = () => {
  const [leagueDetails, setLeagueDetails] = useState(null);
  const { leagueName } = useParams();

  useEffect(() => {
    const fetchLeagueDetailsByName = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/leagues/by-name?leagueName=${encodeURIComponent(leagueName)}`);
        if (response.ok) {
          const data = await response.json();
          setLeagueDetails(data);
        } else {
          console.error('Error fetching league details:', response.statusText);
        }
      } catch (error) {
        console.error('Fetch failed:', error);
      }
    };

    if (leagueName) fetchLeagueDetailsByName();
  }, [leagueName]);

  if (!leagueDetails) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card elevation={3} sx={{ mb: 4 }}>
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
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', color: '#666' }}>
              Teams:
            </Typography>
            {/* Teams component with its own styling */}
            <LeagueTeams teams={leagueDetails.teams} />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DetailedLeaguePage;
