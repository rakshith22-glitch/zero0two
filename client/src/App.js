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
import { useUser } from './components/userContext';
import { UserProvider } from './components/userContext'; 
function App() {

  const PrivateRoute = ({ children, allowedRoles }) => {
    const { user } = useUser(); // Destructure to get user from context

    return user && allowedRoles.includes(user.role) ? children : <Navigate to="/" />;
  };
  return (

    <Router>
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['admin']}>
              <Admin />
            </PrivateRoute>
          } />
          <Route path="/createleague" element={
            <PrivateRoute allowedRoles={['admin']}>
              <CreateLeagueForm />
            </PrivateRoute>
          } />
          <Route path="/createteam" element={
            <PrivateRoute allowedRoles={['admin']}>
              <CreateTeamPage />
            </PrivateRoute>
          } />
          <Route path="/teams" element={
            <PrivateRoute allowedRoles={['admin']}>
              <Teams />
            </PrivateRoute>
          } />
          <Route path="/leagues/:leagueName" element={
            <PrivateRoute allowedRoles={['admin']}>
              <DetailedLeaguePage />
            </PrivateRoute>
          } />
          <Route path="/leagues" element={
            <PrivateRoute allowedRoles={['admin']}>
              <LeaguesPage />
            </PrivateRoute>
          } />
          <Route path="/leagues/:leagueId/add-users" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AddUserToLeague />
            </PrivateRoute>
          } />
          {/* Additional protected routes as needed */}
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
