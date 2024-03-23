import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Card, CardContent, Grid, Container } from '@mui/material';
import LeaguePlayers from '../components/leagueplayers'; // Adjust import path as necessary
// Example icon

const DetailedLeaguePage = () => {
  const [leagueDetails, setLeagueDetails] = useState(null);
  const { leagueName } = useParams();

  useEffect(() => {
    const fetchLeagueDetailsById = async () => {
      try {
        const response = await fetch(`/api/leagues/by-name?leagueName=${encodeURIComponent(leagueName)}`);
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

    if (leagueName) fetchLeagueDetailsById();
  }, [leagueName]);

  return (
    <Container maxWidth="md">
      <Box sx={{ marginTop: 4 }}>
        {leagueDetails ? (
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h4" gutterBottom component="div">
                {/* <SportsSoccerIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> */}
                {leagueDetails.leagueName}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Day of the Week: {leagueDetails.dayOfWeek}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Time: {leagueDetails.time}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Team Composition: {leagueDetails.teamComposition}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Skill Level: {leagueDetails.skillLevel}
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Players:
                </Typography>
                {leagueDetails.players && <LeaguePlayers players={leagueDetails.players} />}
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Typography variant="h5" textAlign="center">Loading...</Typography>
        )}
      </Box>
    </Container>
  );
};

export default DetailedLeaguePage;
