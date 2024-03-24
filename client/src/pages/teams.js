import React, { useState, useEffect } from 'react';
import { Box, Card, Grid, CardContent, Typography, CardActions, Button, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeamsAndPlayers = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/getteams');
                if (!response.ok) throw new Error('Could not fetch teams');
                let teamsData = await response.json();

                // Fetch players details for each team concurrently
                const teamsWithPlayers = await Promise.all(teamsData.map(async (team) => {
                    const playersResponse = await fetch(`/api/teams/${team._id}/details`);
                    const playersData = await playersResponse.json();
                    return { ...team, players: playersData.players };
                }));

                setTeams(teamsWithPlayers);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamsAndPlayers();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 3 }}>
            {teams.map((team) => (
                <Card key={team.id} sx={{ minWidth: 275 }}>
                    <CardContent>
                        
                        <Typography variant="h5" component="div">
                          {team.name}
                        </Typography>
                    
                        <List >
                            {team.players.map((player, index) => (
                                <ListItem key={player.id}>
                                    <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="body1"  sx={{ textTransform: 'uppercase' }}>Player {index + 1}: {player.firstname} {player.lastname}</Typography>
                                        <Typography variant="body1">DUPR: 5.0</Typography>
                                        </Grid>
                                    </Grid>


                                </ListItem>
                            ))}
                        </List>
                    </CardContent>

                </Card>
            ))}
        </Box>
    );
};

export default Teams;
