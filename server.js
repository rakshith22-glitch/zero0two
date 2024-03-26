import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session'
import cors from 'cors';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js'; // Make sure to create this route module
import MongoStore from 'connect-mongo'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors({
  origin: 'https://fabulous-gnome-dd4e16.netlify.app/, http://localhost:3000', // Adjust according to your frontend's origin
  credentials: true,
}));


app.use(session({
  secret: process.env.SESSION_SECRET, // Secret key for signing the session ID cookie
  resave: false, // Avoid resaving sessions that haven't changed
  saveUninitialized: false, // Don't create a session until something is stored
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), // Use MongoDB to store session data
  cookie: {
    httpOnly: true, // Enhances security by restricting access to the cookie from client-side scripts
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (requires HTTPS)
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Define __dirname for use with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Use authRoutes for authentication paths
app.use('/api', authRoutes);

// Route for handling any other requests and serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connection established"))
  .catch((error) => console.error("MongoDB connection failed:", error.message));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
