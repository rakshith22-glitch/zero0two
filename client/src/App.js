import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Ensure the path is correct

// Import your page components
import Login from './pages/login';
import Signup from './pages/singup';
import HomePage from './pages/homepage';
import AdminPage from './pages/admin';
import CreateLeagueForm from './pages/createleague';
import LeaguesPage from './pages/leagues';
import AddTeamToLeague from './pages/addteamtoleague';
import AddPlayerToLeague from './pages/addteamtoleague';
import DetailedLeaguePage from './pages/leaguedetails';
import CreateTeamPage from './pages/createteam';
import TeamsPage from './pages/teams';
import Navbar from './components/navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/"
            element={
              <AdminPage />
            }
          />
          <Route
            path="/createleague"
            element={
              <CreateLeagueForm />
            }
          />
          <Route
            path="/createteam"
            element={
              <CreateTeamPage />
            }
          />
          <Route
            path="/teams"
            element={
              <TeamsPage />
            }
          />
           <Route
            path="/addplayers"
            element={
              <AddPlayerToLeague />
            }
          />
          <Route
            path="/leagues/:leagueName"
            element={
              <DetailedLeaguePage />
            }
          />
          <Route
            path="/leagues"
            element={
              <LeaguesPage />
            }
          />
          <Route
            path="/leagues/:leagueId/add-users"
            element={
              <AddTeamToLeague />
            }
          />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
