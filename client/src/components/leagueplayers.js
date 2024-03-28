import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Box, Card, CardContent } from '@mui/material';

const LeaguePlayers = ({ players }) => {
  const [playerDetails, setPlayerDetails] = useState([]);
console.log(players)
  useEffect(() => {
    const fetchPlayerDetails = async () => {
      const playerInfoPromises = players.map(playerId =>
        fetch(`/api/users/${playerId}`).then(response => response.json())
      );

      try {
        const playersInfo = await Promise.all(playerInfoPromises);
        setPlayerDetails(playersInfo);
        console.log("player deatisl", playerDetails)
      } catch (error) {
        console.error('Error fetching player details:', error);
      }
    };


    if (players) {
      fetchPlayerDetails();
      console.log(playerDetails)
    }
  }, [players]);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 4 }}> {/* Centers the box and applies margin */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            League Players
          </Typography>
          <List>
            {playerDetails.map((player, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar src={player.avatarUrl || ''} alt={`${player.firstname} ${player.lastname}`} /> {/* Assuming players have avatar URLs */}
                </ListItemAvatar>
                <ListItemText primary={`${player.firstname} ${player.lastname}`} secondary={`Player ID: ${player._id}`}  />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LeaguePlayers;
