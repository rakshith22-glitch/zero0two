import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/protectedroute'; // Ensure the path is correct

// Import your page components
import Login from './pages/login';
import Signup from './pages/singup';
import HomePage from './pages/homepage';
import AdminPage from './pages/admin';
import CreateLeagueForm from './pages/createleague';
import LeaguesPage from './pages/leagues';
import AddUserToLeague from './pages/addusertoleague';
import DetailedLeaguePage from './pages/leaguedetails';
import CreateTeamPage from './pages/createteam';
import TeamsPage from './pages/teams';
import Navbar from './components/navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']} component={AdminPage} />
          } 
        />
        <Route 
          path="/createleague" 
          element={
            <ProtectedRoute allowedRoles={['admin']} component={CreateLeagueForm} />
          } 
        />
        <Route 
          path="/createteam" 
          element={
            <ProtectedRoute allowedRoles={['admin']} component={CreateTeamPage} />
          } 
        />
        <Route 
          path="/teams" 
          element={
            <ProtectedRoute allowedRoles={['admin']} component={TeamsPage} />
          } 
        />
        <Route 
          path="/leagues/:leagueName" 
          element={
            <ProtectedRoute allowedRoles={['admin']} component={DetailedLeaguePage} />
          } 
        />
        <Route 
          path="/leagues" 
          element={
            <ProtectedRoute allowedRoles={['admin']} component={LeaguesPage} />
          } 
        />
        <Route 
          path="/leagues/:leagueId/add-users" 
          element={
            <ProtectedRoute allowedRoles={['admin']} component={AddUserToLeague} />
          } 
        />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
