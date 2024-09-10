import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Home.scss';
import News from '../../functionalities/News.jsx';
import Weather from '../../functionalities/Weather.jsx'
import countries from "../../constants/countries.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRadio } from '@fortawesome/free-solid-svg-icons';
import Radio from '../../functionalities/Radio.jsx';
import useRadio from '../../../services/useRadio.js';


const Home = () => {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const [countryName, setCountryName] = useState('');
  const [localDate, setLocalDate] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const videoNumber = useMemo(() => Math.floor(Math.random() * 3) + 1, []);
  const [cityName, setCityName] = useState('');
  // Generate unique key for page refresh
  const videoKey = useMemo(() => Date.now(), []);
  
  const { isPlaying, toggleRadio } = useRadio(countryName);



  // Extract city name from timezone
  const getCityFromTimezone = (timezone) => {
    return timezone.split('/').pop().replace(/_/g, ' ');
  };

  // Fetch weather data
  const fetchWeatherData = async (code) => {
    const API_KEY = import.meta.env.VITE_WEATHER;

    const country = countries[code];
    if (!country) {
      console.error("Country not found");
      return;
    }
    
    const city = getCityFromTimezone(country.timezone);
    setCityName(city);
    const url = `https://api.weatherbit.io/v2.0/current?key=${API_KEY}&city=${encodeURIComponent(city)}&country=${code}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setWeatherData(data.data[0]);
      } else {
        console.error("No weather data found");
      }
    } catch (error) {
      console.error("Error in retrieving weather data:", error);
    }
  };

  useEffect(() => {
    if (!countryCode) {
      navigate('/');
      return;
    }

    const code = countryCode.toUpperCase();
    const country = countries[code] || { name: 'Unknown Country', timezone: 'UTC' };
    setCountryName(country.name);

    // Set local date and time based on country's timezone
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: country.timezone,
      hour12: false
    };

    const updateLocalTime = () => {
      setLocalDate(new Date().toLocaleString('en-US', options));
    };

    updateLocalTime();
    const timer = setInterval(updateLocalTime, 1000);

    // Fetch weather data
    fetchWeatherData(code);

    return () => clearInterval(timer);
  }, [countryCode, navigate]);

  if (!countryCode) {
    return null;
  }

  return (
    <>
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      <video key={videoKey} className="background-video" autoPlay loop muted playsInline loading="lazy">
        <source src={`/../../backgroundvideos/${countryCode.toUpperCase()}/${countryCode.toUpperCase()}${videoNumber}.mp4`} type="video/mp4" />
      </video>
      <div className="video-overlay"></div>
      <div className="home">
        <header>
          <h1>{countryName}</h1>
          <p className="date">{localDate}</p>
          <div className="radio-icon" onClick={toggleRadio}>
              <FontAwesomeIcon icon={faRadio} color={isPlaying ? "green" : "white"} />
          </div>
        </header>
      
        <main>
  <div className="column left">
  
    <section className="weather">
      <h2>Weather in {countryName} ({cityName})</h2>
      {weatherData ? (
        <div>
          <p>Temperature: {weatherData.temp}°C</p>
          <p>Description: {weatherData.weather.description}</p>
          <img src={`https://www.weatherbit.io/static/img/icons/${weatherData.weather.icon}.png`} alt="Weather icon" />
          <p>Wind Speed: {weatherData.wind_spd.toFixed(1)} m/s</p>
          <p>Humidity: {weatherData.rh}%</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </section>

    <section className="currency">
      <h2>Exchange Rates</h2>
      {/* Currency exchange rates content specific to the country */}
    </section>

    <section className="economics">
      <h2>Economic Indicators</h2>
      {/* Economic indicators content specific to the country */}
    </section>
  </div>

  <div className="column center">
    <News 
      countryName={countryName}
      countryCode={countryCode}
    />
    
    <section className="twitter">
      <h2>Trending on Twitter in {countryName}</h2>
      {/* Twitter API content specific to the country */}
    </section>

    <section className="music">
      <h2>Spotify Top Tracks in {countryName}</h2>
      {/* Spotify API content specific to the country */}
    </section>
  </div>

  <div className="column right">
    <section className="language">
      <h2>Learn {getLanguageByCountry(countryCode)}</h2>
      {/* Language learning AI content specific to the country */}
    </section>

    <section className="words">
      <h2>Word of the Day in {getLanguageByCountry(countryCode)}</h2>
      {/* Words of the day content specific to the country's language */}
    </section>

    <section className="history">
      <h2>This Day in {countryName}'s History</h2>
      {/* Historical fact API content specific to the country */}
    </section>

    <section className="fun-fact">
      <h2>Did You Know? ({countryName} Edition)</h2>
      {/* Fun fact API content specific to the country */}
    </section>
  </div>
</main>
      </div>
    </>
  );
};

// Helper function to get the main language of a country (simplified)
function getLanguageByCountry(countryCode) {
  if (!countryCode) return 'the local language';
  
  const code = countryCode.toUpperCase();
  const languages = {
    FR: 'French', JP: 'Japanese', BR: 'Portuguese', AU: 'English', EG: 'Arabic',
    // ... (other languages)
  };
  return languages[code] || 'the local language';
}

export default Home;