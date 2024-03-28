import React from 'react';
import { Link } from 'react-router-dom';

function Admin() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#f0f0f0', padding: '20px' }}>
        <h2 style={{ marginBottom: '20px' }}>Admin Panel</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/login" style={{ textDecoration: 'none', color: '#333' }}>Login</Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/signup" style={{ textDecoration: 'none', color: '#333' }}>Signup</Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/leagues" style={{ textDecoration: 'none', color: '#333' }}>Leagues</Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/createteam" style={{ textDecoration: 'none', color: '#333' }}>Create Team</Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/createleague" style={{ textDecoration: 'none', color: '#333' }}>Create League</Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/teams" style={{ textDecoration: 'none', color: '#333' }}>Teams</Link>
          </li>
        </ul>
      </div>
      {/* Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        {/* Content goes here */}
        <h1>Welcome Admin</h1>
        {/* You can add more content here */}
      </div>
    </div>
  );
}

export default Admin;
