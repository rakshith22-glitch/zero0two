import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Welcome to Our Application</h1>
      <p>Get started by checking out our leagues!</p>
      <div>
        <Link to="/login">login</Link>
      </div>
    </div>
  );
}

export default HomePage;
