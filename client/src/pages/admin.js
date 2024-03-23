import React from 'react';
import { Link } from 'react-router-dom';

function Admin() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Welcome Admin</h1>
      {/* <p>Get started by logging in or signing up!</p> */}
      {/* <div>
        <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
        <Link to="/signup">Signup</Link>
      </div> */}
    </div>
  );
}

export default Admin;