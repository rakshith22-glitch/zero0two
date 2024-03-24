import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/singup';
import HomePage from './pages/homepage';
import Admin from './pages/admin'; // Assuming this is the correct import for your AdminPage component
import CreateLeagueForm from './pages/createleague';
import LeaguesPage from './pages/leagues';
import AddUserToLeague from './pages/addusertoleague'; // Assuming you've created this component
import DetailedLeaguePage from './pages/leaguedetails';
import CreateTeamPage from './pages/createteam';
import Navbar from './components/navbar';
import Teams from './pages/teams';

function App() {
  const [role, setRole] = useState('');

  useEffect(() => {
    // Simulate checking token and setting role
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const PrivateRoute = ({ children, allowedRoles }) => {
    return allowedRoles.includes(role) ? children : <Navigate to="/" />;
  };

  return (
   
    <Router>
     <Navbar/>
      <Routes>
        <Route path="/login" element={<Login onLogin={(userRole) => setRole(userRole)} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={
          <Admin />
        } />
        <Route path="/createleague" element={
          <CreateLeagueForm />
        } />
        <Route path="/createteam" element={
          <CreateTeamPage />
        } />
        <Route path="/teams" element={
          <Teams />
        } />
        <Route path="/leagues/:leagueName" element={<DetailedLeaguePage />} />
        <Route path="/leagues" element={<LeaguesPage role={role} />} />
        <Route path="/leagues/:leagueId/add-users" element={
          <PrivateRoute allowedRoles={['admin']}>
            <AddUserToLeague />
          </PrivateRoute>
        } />
        {/* Additional routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
