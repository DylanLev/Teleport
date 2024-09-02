import React from 'react';
import Navbar from "./components/navbar/Navbar.jsx";
import Body from "./components/body/Body.jsx";
import Footer from "./components/footer/Footer.jsx";
import "./App.scss";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Body />
      <Footer />
    </div>
  );
}

export default App;
