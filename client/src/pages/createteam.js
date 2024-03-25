import React, { useState, useEffect } from 'react';
import { Button, TextField, Autocomplete, Box, Typography, Snackbar, Alert, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/userContext';

const CreateTeamPage = () => {
    const [teamName, setTeamName] = useState('');
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const navigate = useNavigate();
    const { user } = useUser();

    console.log(user)
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`);
                if (!response.ok) throw new Error('Failed to fetch players');
                const data = await response.json();
                setPlayers(data);
            } catch (error) {
                console.error('Error fetching players:', error);
                setSnackbarMessage('Failed to fetch players');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        };
        fetchPlayers();
    }, []);

  const handleCreateTeam = async () => {
        // Assuming you have a way to retrieve the current user's ID
        const currentUserId = user; // Replace this with actual logic to retrieve the current user's ID
        const teamData = {
            name: teamName,
            players: selectedPlayers.map(p => p._id),
            createdBy: currentUserId
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/teams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(teamData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create team');
            }

            setSnackbarMessage('Team created successfully');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            navigate('/teams'); // Adjust as necessary to redirect to the appropriate page
        } catch (error) {
            console.error('Error creating team:', error);
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
        }}>
            <Card sx={{ minWidth: 275, width: '30%', p: 3 }}>
                <Typography variant="h4" component="div" sx={{ mb: 2 }}>Create Team</Typography>
                <TextField
                    label="Team Name"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                />
                <Autocomplete
                    multiple
                    options={players}
                    getOptionLabel={(option) => `${option.firstname} ${option.lastname}`}
                    onChange={(event, newValue) => setSelectedPlayers(newValue)}
                    renderInput={(params) => <TextField {...params} variant="outlined" label="Add Players" />}
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" onClick={handleCreateTeam}>Create Team</Button>
            </Card>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CreateTeamPage;
