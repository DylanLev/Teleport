import React, { useState, useEffect } from 'react';
import './Mailbox.scss';

const Mailbox = () => {
  const [email, setEmail] = useState('');
  const [buttonColor, setButtonColor] = useState('#4285F4'); // Google Blue

  useEffect(() => {
    const colors = ['#4285F4', '#34A853', '#FBBC05', '#EA4335']; // Google colors
    let colorIndex = 0;

    const intervalId = setInterval(() => {
      colorIndex = (colorIndex + 1) % colors.length;
      setButtonColor(colors[colorIndex]);
    }, 3000); // Change color every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Email submitted:', email);
  };

  const handleGoogleSignIn = () => {
    // Implement Google Sign-In logic here
    console.log('Google Sign-In clicked');
  };

  return (
    <div className="mailbox">
      <form onSubmit={handleSubmit} className="mailbox__form">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Type your email..."
          className="mailbox__input"
          required
        />
        <button 
          type="submit" 
          className="mailbox__submit"
          style={{ backgroundColor: buttonColor }}
        >
          Teleport me to...
        </button>
      </form>
      <button onClick={handleGoogleSignIn} className="mailbox__google">
        Connect with Google
      </button>
      
    </div>
  );
};

export default Mailbox;