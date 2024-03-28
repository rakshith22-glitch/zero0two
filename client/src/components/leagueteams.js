import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Collapse, IconButton, Table, TableBody, TableCell, TableRow, TableHead, Avatar, Grid, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const LeagueTeams = ({ teams }) => {
    const [teamDetails, setTeamDetails] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [error, setError] = useState(null); // State to hold error message
    console.log(teams)
    useEffect(() => {
        const fetchTeamDetails = async () => {
            // Assuming team details include player info
            const teamInfoPromises = teams.map(teamId =>
                fetch(`/api/teams/${teamId}/details`).then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch team details');
                    }
                    return response.json();
                })
            );

            try {
                const teamsInfo = await Promise.all(teamInfoPromises);
                setTeamDetails(teamsInfo);
                setError(null); // Clear error if fetching succeeds
            } catch (error) {
                console.error('Error fetching team details:', error);
                setError('Failed to fetch team details. Please try again later.');
            }
        };

        if (teams.length) {
            fetchTeamDetails();
        }
    }, [teams]);

    const handleExpandClick = (teamId) => {
        setExpanded(prevExpanded => ({
            ...prevExpanded,
            [teamId]: !prevExpanded[teamId],
        }));
    };

    return (
        <Grid container spacing={3}>
            {error && (
                <Grid item xs={12}>
                    <Alert severity="error">{error}</Alert>
                </Grid>
            )}
            {teamDetails.map((team, index) => (
                <Grid item xs={12} key={team._id}>
                    <Card variant="outlined">
                        <CardContent>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" gutterBottom>
                                    Team {index + 1}: {team.name}
                                </Typography>
                                <IconButton
                                    onClick={() => handleExpandClick(team._id)}
                                    aria-expanded={expanded[team._id] || false}
                                    aria-label="show more"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                            </div>
                            <Collapse in={expanded[team._id] || false} timeout="auto" unmountOnExit>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Player</TableCell>
                                            <TableCell align="right">Details</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {team.players?.map((player) => (
                                            <TableRow key={player._id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar src={player.avatarUrl || ''} alt={`${player.firstname} ${player.lastname}`} sx={{ mr: 1 }} />
                                                        {`${player.firstname} ${player.lastname}`}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">Player ID: {player._id}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Collapse>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default LeagueTeams;
