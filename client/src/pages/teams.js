import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
const StyledTable = styled(Table)({
    minWidth: 550,
  });
  

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaguesData = async (team) => {
            const leaguesDataPromises = team.leagues.map(async (leagueId) => {
                const leagueResponse = await fetch(`https://zero0two-1.onrender.com/api/leagues/${leagueId}`);
                const leagueData = await leagueResponse.json();
                return leagueData.leagueName;
            });

            const leaguesData = await Promise.all(leaguesDataPromises);
            return leaguesData;
        };

        const fetchTeamsAndPlayers = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://zero0two-1.onrender.com/api/teams`);
                if (!response.ok) throw new Error('Could not fetch teams');
                let teamsData = await response.json();

                // Fetch players details and league names for each team concurrently
                const teamsWithPlayersAndLeagues = await Promise.all(teamsData.map(async (team) => {
                    const playersResponse = await fetch(`https://zero0two-1.onrender.com/api/teams/${team._id}/details`);
                    const playersData = await playersResponse.json();
                    const leagueNames = await fetchLeaguesData(team);
                    return { ...team, players: playersData.players, leagueNames };
                }));

                setTeams(teamsWithPlayersAndLeagues);
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
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                gap: '20px', // Add gap between the cards
            }}
        >
            {teams.map((team) => (
                <Card key={team._id} sx={{ width: '100%', maxWidth: '500px' }}>
                    <CardContent>
                        <Typography variant="h5" component="div" sx={{ color: '#0277bd', marginBottom: '20px' }}>
                            {team.name}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            {team.leagueNames && team.leagueNames.length ? `Leagues: ${team.leagueNames.join(', ')}` : 'Not a part of any league'}
                        </Typography>
                        <StyledTable>
                            <Table >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Player</TableCell>
                                        <TableCell>DUPR</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {team.players.map((player, index) => (
                                        <TableRow key={player._id}>
                                            <TableCell>
                                                {`${player.firstname} ${player.lastname}`}
                                            </TableCell>
                                            <TableCell>
                                                5.0
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </StyledTable>
                    </CardContent>

                </Card>
            ))}
        </Box>
    );
};

export default Teams;
