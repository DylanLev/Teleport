import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CountryChoice.scss';

const CountryChoice = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const carouselRef = useRef(null);

  const countries = [
    { name: 'France', code: 'FR' },
    { name: 'Japan', code: 'JP' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Australia', code: 'AU' },
    { name: 'Egypt', code: 'EG' },
    { name: 'Canada', code: 'CA' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Italy', code: 'IT' },
    { name: 'Mexico', code: 'MX' },
    { name: 'South Africa', code: 'ZA' },
    { name: 'Spain', code: 'ES' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Israel', code: 'IL' },
    { name: 'United States', code: 'US' },
    { name: 'China', code: 'CN' },
    { name: 'Russia', code: 'RU' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Sweden', code: 'SE' },
    { name: 'Switzerland', code: 'CH' },
    { name: 'South Korea', code: 'KR' },
    { name: 'Portugal', code: 'PT' },
    { name: 'Greece', code: 'GR' },
    { name: 'Turkey', code: 'TR' },
    { name: 'New Zealand', code: 'NZ' },
  ];

  useEffect(() => {
    const carousel = carouselRef.current;
    let scrollAmount = 0;
    const step = 1;
    const interval = 50;

    const smoothScroll = () => {
      carousel.scrollLeft += step;
      scrollAmount += step;

      if (scrollAmount >= carousel.scrollWidth / 2) {
        carousel.scrollLeft = 0;
        scrollAmount = 0;
      }
    };

    const timer = setInterval(smoothScroll, interval);

    return () => clearInterval(timer);
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSearchTerm(country.name);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    const foundCountry = countries.find(country => 
      country.name.toLowerCase() === event.target.value.toLowerCase()
    );
    setSelectedCountry(foundCountry || null);
  };

  const handleTeleport = () => {
    if (selectedCountry) {
      console.log(`Navigating to: /home/view/${selectedCountry.code.toLowerCase()}`);
      navigate(`/home/view/${selectedCountry.code.toLowerCase()}`);
    }
  };

  return (
    <div className="country-choice">
      <h1>Where would you like to teleport today?</h1>
      <input
        type="text"
        placeholder="Search for a country..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="country-search"
      />

      <div className="country-carousel" ref={carouselRef}>
        {countries.concat(countries).map((country, index) => (
          <div 
            key={index} 
            className={`country-item ${selectedCountry === country ? 'selected' : ''}`}
            onClick={() => handleCountrySelect(country)}
          >
            <img src={`https://flagsapi.com/${country.code}/shiny/64.png`} alt={country.name} />
            <span>{country.name}</span>
          </div>
        ))}
      </div>

      <button 
        className="teleport-button" 
        onClick={handleTeleport}
        disabled={!selectedCountry}
      >
        Teleport to {selectedCountry ? selectedCountry.name : '...'}
      </button>
    </div>
  );
};

export default CountryChoice;