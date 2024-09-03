import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__links">
          <a href="#about" className="footer__link">About Us</a>
          <a href="#contact" className="footer__link">Contact</a>
          <a href="#privacy" className="footer__link">Privacy Policy</a>
          <a href="#terms" className="footer__link">Terms of Service</a>
        </div>
        <div className="footer__social">
          <a href="https://facebook.com" className="footer__social-link" aria-label="Facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" className="footer__social-link" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com" className="footer__social-link" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://linkedin.com" className="footer__social-link" aria-label="LinkedIn">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} Teleport. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
