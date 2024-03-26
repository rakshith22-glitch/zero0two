import React, { useState, useEffect } from 'react';
import { Button, TextField, Autocomplete, Box, Typography, Snackbar, Alert, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const CreateTeamPage = () => {
    const [teamName, setTeamName] = useState('');
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch(`api/users`);
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
        const teamData = {
            name: teamName,
            players: selectedPlayers.map(p => p._id),
           
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
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            borderRadius: '8px',
        }}>
            <Typography component="h1"
                variant="h5"
                sx={{
                    color: '#0277bd', // Dark blue for contrast and readability
                    marginBottom: '20px', // Space below the title for breathing room
                }}>Create Team</Typography>
            <Card
                sx={{
                    width: '100%', // Ensures the card extends to fit the container
                    maxWidth: '350px', // Set to 350px to match the style
                    padding: '20px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Subtle shadow for depth
                    borderRadius: '8px', // Rounded corners for a softer look
                    backgroundColor: '#ffffff', // Bright background to stand out
                    display: 'flex', // Creates a flex container
                    flexDirection: 'column', // Organizes children in a vertical column
                    alignItems: 'center',
                }}
            >
                <TextField
                    label="Team Name"
                    variant="outlined"
                    fullWidth
                    sx={{
                        mb: 2, '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#29b6f6',
                            },
                            '&:hover fieldset': {
                                borderColor: '#0288d1',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#0277bd',
                            },
                        }
                    }}
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                />
                <Autocomplete
                    fullWidth
                    multiple
                    options={players}
                    getOptionLabel={(option) => `${option.firstname} ${option.lastname}`}
                    onChange={(event, newValue) => setSelectedPlayers(newValue)}
                    renderInput={(params) => <TextField {...params} variant="outlined" label="Add Players"
                        sx={{
                            '& .MuiOutlinedInput-root':
                            {
                                '& fieldset': {
                                    borderColor: '#29b6f6',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#0288d1',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#0277bd',
                                },
                            },
                            mb: 2,
                        }
                        } />}
                />
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleCreateTeam}
                    sx={{
                        mt: 3,
                        mb: 2,
                        backgroundColor: '#66bb6a', // A vibrant green, matching the "Signup" button
                        '&:hover': {
                            backgroundColor: '#388e3c',
                        },
                        maxWidth: 350
                    }}
                >
                    Create Team
                </Button>

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