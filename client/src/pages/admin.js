import React from 'react';
import { Link } from 'react-router-dom';

function Admin() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Welcome Admin</h1>
      {/* <p>Get started by logging in or signing up!</p> */}
      <li>
        <Link to="/login" style={{ marginRight: '10px' }}>Login</Link> </li>
      <li> <Link to="/signup">Signup</Link> </li>
      <li> <Link to="/leagues"> leagues </Link> </li>
      <li><Link to="/createteam"> createteam </Link> </li>
      <li> <Link to="/createleague"> createleague </Link>

      </li>
    </div>
  );
}

export default Admin;