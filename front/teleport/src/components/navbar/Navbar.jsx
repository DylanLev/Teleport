import React from 'react';
import './Navbar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthAmericas } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__logo" style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>TELEP</h1>
        <FontAwesomeIcon icon={faEarthAmericas} spin style={{ fontSize: '1.5rem', color: '#ffffff', margin: '0 0.5rem' }} />
        <h1 style={{ margin: 0 }}>RT</h1>
      </div>
     
    </nav>
  );
}

export default Navbar;
