import express from 'express';
import User from '../models/User.js';
import League from '../models/League.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

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
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send({ error: 'Login failed!' });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
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

router.post('/leagues/:leagueId/add-player', async (req, res) => {
    const { playerId } = req.body;
    const { leagueId } = req.params;

    try {
        const league = await League.findById(leagueId);

        if (!league) {
            return res.status(404).json({ message: 'League not found' });
        }

        if (!league.players.includes(playerId)) {
            league.players.push(playerId);
            await league.save();
            res.json(league);
        } else {
            res.status(400).json({ message: 'Player already in league' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to add player to league', error });
    }
});

router.get('/leagues/by-name', async (req, res) => {
    try {
        const { leagueName } = req.query; // Get league name from query parameters
        if (!leagueName) {
            return res.status(400).send({ message: 'League Name is required.' });
            console.log(res);
        }

        // Use findOne to search for a single document by leagueName
        const leagueDetails = await League.findOne({ leagueName: leagueName });
       

        if (!leagueDetails) {
            return res.status(404).send({ message: 'League not found.' });
            console.log(res);
        }

        res.json(leagueDetails);
    } catch (error) {
        console.error('Failed to fetch league details by name:', error);
        res.status(500).send({ message: 'Failed to fetch league details due to an error.' });
        console.log(res);
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


  router.post('/teams/:teamId/join', async (req, res) => {
    const { userId } = req.body; // Assume the user's ID is sent in the request body
    const { teamId } = req.params;
  
    try {
      // Add the team to the user's teams array
      const user = await User.findById(userId);
      if (!user.teams.includes(teamId)) {
        user.teams.push(teamId);
        await user.save();
      }
  
      // Optionally, also add the user to the team's players array
      const team = await Team.findById(teamId);
      if (!team.players.includes(userId)) {
        team.players.push(userId);
        await team.save();
      }
  
      res.send({ message: 'User added to team successfully' });
    } catch (error) {
      res.status(400).send({ message: 'Error adding user to team' });
    }
  });

export default router;