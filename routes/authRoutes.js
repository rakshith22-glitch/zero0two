import express from 'express';
import User from '../models/User.js';
import League from '../models/League.js';
import Team from '../models/Team.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).send({ message: 'Login failed. User not found.' });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send({ message: 'Login failed. Incorrect password.' });
        }

        // Authentication successful, store user ID in session
        req.session.userId = user._id;
        res.status(200).send({ message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({ message: 'Server error during login process.' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.status(500).send({ message: 'Could not log out, please try again' });
        } else {
            res.send({ message: 'Logout successful' });
        }
    });
});

router.get('/session', (req, res) => {
    if (req.session.userId) {
      // Optionally, return more data about the user
      res.status(200).json({ isLoggedIn: true, userId: req.session.userId });
    } else {
      res.status(200).json({ isLoggedIn: false });
    }
  });

  router.get('/checkSession', async (req, res) => {
    if (req.session.userId) {
        try {
            // Assuming you have a User model to fetch user details from the database
            const user = await User.findById(req.session.userId).exec();

            if (user) {
                // Return relevant user details. Adjust the fields based on your User model.
                res.status(200).json({
                    isLoggedIn: true,
                    user: {
                        id: user._id,
                        email: user.email,
                        role: user.role,
                        // Include any other user details you want to return
                    }
                });
            } else {
                // If the user ID in the session does not correspond to any user in the database
                res.status(404).json({ isLoggedIn: false, message: "User not found" });
            }
        } catch (error) {
            console.error('Session check failed:', error);
            res.status(500).json({ isLoggedIn: false, message: "Failed to check session" });
        }
    } else {
        res.status(200).json({ isLoggedIn: false });
    }
});


router.post('/signup', async (req, res) => {
    const { firstname, lastname, email, password, role } = req.body; // Include username and optionally role
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'Email already in use' });
        }

        // Optionally handle roles securely, e.g., defaulting to 'user' role to prevent unauthorized 'admin' role assignment
        const userRole = role === 'admin' ? 'user' : role;

        const user = new User({ firstname, lastname, email, password, role: userRole }); // Include username and role in the new user object
        await user.save();

        // Optionally: Generate a token upon signup
        // const token = generateToken(user._id); // Implement this function based on your auth setup

        res.status(201).send({ message: 'User created successfully'/*, token */ }); // Optionally send back the token
    } catch (error) {
        res.status(400).send({ message: 'Error creating user', error: error.message });
    }
});


router.get('/users', async (req, res) => {
    try {
        // Optionally, add authentication and authorization checks here

        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch users' });
    }
});

router.get('/users/:playerId', async (req, res) => {
    try {
        const { playerId } = req.params;

        // Find the user by userId
        const user = await User.findById(playerId);

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Failed to fetch user by ID:', error);
        res.status(500).send({ error: 'Failed to fetch user by ID' });
    }
});

router.post('/leagues', async (req, res) => {
    try {
        const league = new League(req.body);
        await league.save();
        res.status(201).send(league);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/leagues', async (req, res) => {
    try {
        const leagues = await League.find();
        res.status(200).send(leagues);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/leagues/:leagueId', async (req, res) => {
    const { leagueId } = req.params;

    try {
        const league = await League.findById(leagueId);
        if (!league) {
            return res.status(404).json({ message: 'League not found' });
        }
        res.status(200).json(league);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch league details', error });
    }
});


router.get('/leagues/by-name', async (req, res) => {
    try {
        const { leagueName } = req.query; // Get league name from query parameters
        if (!leagueName) {
            return res.status(400).send({ message: 'League Name is required.' });
        }

        // Use findOne to search for a single document by leagueName
        const leagueDetails = await League.findOne({ name: leagueName }); // Change leagueName to name

        if (!leagueDetails) {
            return res.status(404).send({ message: 'League not found.' });
        }

        res.json(leagueDetails);
    } catch (error) {
        console.error('Failed to fetch league details by name:', error);
        res.status(500).send({ message: 'Failed to fetch league details due to an error.' });
    }
});




router.get('/users/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send({ message: 'Failed to fetch user details.' });
    }
});


router.post('/teams', async (req, res) => {
    const { name, players, createdBy } = req.body;

    try {
        const newTeam = new Team({
            name,
            players, // Array of player IDs
            createdBy // ID of the user creating the team
        });

        await newTeam.save();
        res.status(201).send(newTeam);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.get('/teams', async (req, res) => {
    try {
        const teams = await Team.find(); // Fetch all teams
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/teams/:teamId/join', async (req, res) => {
    const { userId } = req.body;
    const { teamId } = req.params;

    try {
        // Add the team to the user's teams array
        const user = await User.findById(userId);
        if (!user.teams.includes(teamId)) {
            user.teams.push(teamId);
            await user.save();
        }

        // Add the user to the team's players array and fetch updated team details
        const team = await Team.findById(teamId);
        if (!team.players.includes(userId)) {
            team.players.push(userId);
            await team.save();
        }

        // Fetch updated team details including player information
        const updatedTeam = await Team.findById(teamId).populate('players', 'firstname', 'lastname'); // Customize 'name' to the fields you want

        res.json({ message: 'User added to team successfully', team: updatedTeam });
    } catch (error) {
        res.status(400).send({ message: 'Error adding user to team' });
    }
});


router.post('/leagues/:leagueName/add-team', async (req, res) => {
    const { teamName } = req.body; // Changed from playerId to teamName
    const { leagueName } = req.params;

    try {
        // Find the league by leagueName
        const league = await League.findOne({ leagueName });

        if (!league) {
            return res.status(404).json({ message: 'League not found' });
        }

        // Find the team by teamName
        const team = await Team.findOne({ name: teamName });

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        // Check if the team is already in the league
        if (!league.teams.includes(team._id)) {
            league.teams.push(team._id); // Add team to league
            await league.save();
            res.json(league);
        } else {
            res.status(400).json({ message: 'Team already in league' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to add team to league', error });
    }
});

router.post('/leagues/:leagueName/add-player', async (req, res) => {
    const { playerId } = req.body; // Changed from teamName to playerId
    const { leagueName } = req.params;

    try {
        // Find the league by leagueName
        const league = await League.findOne({ leagueName });

        if (!league) {
            return res.status(404).json({ message: 'League not found' });
        }

        // Find the player by playerId
        const player = await User.findById(playerId);

        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        // Check if the player is already in the league
        if (!league.players.includes(player._id)) {
            league.players.push(player._id); // Add player to league
            await league.save();
            res.json(league);
        } else {
            res.status(400).json({ message: 'Player already in league' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to add player to league', error });
    }
});


router.get('/teams/:teamId/details', async (req, res) => {
    const { teamId } = req.params;

    try {
        const team = await Team.findById(teamId).populate('players'); // Populating 'players' array
        if (!team) {
            return res.status(404).send({ message: 'Team not found' });
        }

        // Assuming the population was successful and 'team' now includes detailed 'players' info
        res.json(team);
    } catch (error) {
        console.error('Error fetching team details:', error);
        res.status(400).send({ message: 'Error fetching team details' });
    }
});


export default router;