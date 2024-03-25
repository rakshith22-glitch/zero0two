import React, { useState, useEffect } from 'react';
import {
    Box, Card, CardContent, Typography, Collapse, IconButton, Table, TableBody, TableCell, TableRow, TableHead, Avatar
} from '@mui/material';
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

    useEffect(() => {
        const fetchTeamDetails = async () => {
            // Assuming team details include player info
            const teamInfoPromises = teams.map(teamId =>
                fetch(`${process.env.REACT_APP_API_URL}/api/teams/${teamId}/details`).then(response => response.json())
            );

            try {
                const teamsInfo = await Promise.all(teamInfoPromises);
                setTeamDetails(teamsInfo);
            } catch (error) {
                console.error('Error fetching team details:', error);
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
        <Box sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>
            <Card variant="outlined">
                <CardContent>
                    <h2 component="div" gutterBottom>
                        League Teams
                    </h2>
                    {teamDetails.map((team, index) => (
                        <React.Fragment key={team._id}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                                    {/* Prepend "Team" and the index + 1 before the team name */}
                                    Team {index + 1}: {team.name}
                                </Typography>
                                <ExpandMore
                                    expand={expanded[team._id] || false}
                                    onClick={() => handleExpandClick(team._id)}
                                    aria-expanded={expanded[team._id] || false}
                                    aria-label="show more"
                                >
                                    <ExpandMoreIcon />
                                </ExpandMore>
                            </Box>
                            <Collapse in={expanded[team._id] || false} timeout="auto" unmountOnExit>
                                <Table size="small" aria-label="players">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><h3>Players </h3></TableCell>
                                            <TableCell align="center"><h3>Details</h3></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {team.players?.map((player, playerIndex) => (
                                            <TableRow key={player._id}>
                                                <TableCell component="th" scope="row">
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar src={player.avatarUrl || ''} alt={`${player.firstname} ${player.lastname}`} sx={{ mr: 2 }} />
                                                        {`${player.firstname} ${player.lastname}`}
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">Player ID: {player._id}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Collapse>
                        </React.Fragment>
                    ))}
                </CardContent>
            </Card>
        </Box>
    );
};

export default LeagueTeams;