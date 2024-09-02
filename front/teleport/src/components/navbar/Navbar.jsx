import React from 'react';
import './Navbar.scss';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <h1>Teleport</h1>
      </div>
      <ul className="navbar__links">
        <li className="navbar__item"><a href="#home">Home</a></li>
        <li className="navbar__item"><a href="#explore">Explore Countries</a></li>
        <li className="navbar__item"><a href="#languages">Languages</a></li>
        <li className="navbar__item"><a href="#culture">Cultural Insights</a></li>
        <li className="navbar__item"><a href="#about">About Us</a></li>
      </ul>
      <div className="navbar__actions">
        <button className="navbar__login">Log In</button>
        <button className="navbar__signup">Sign Up</button>
      </div>
    </nav>
  );
}

export default Navbar;
