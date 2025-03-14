import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <div className="nav-logo">Project Scheduler</div>
      <ul className="nav-links">
        <li><Link to="/">Scheduler</Link></li>
        <li><Link to="/create">Create Projects/People</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
