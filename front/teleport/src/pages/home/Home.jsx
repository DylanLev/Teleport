import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Home.scss';
import News from '../../functionalities/News.jsx';
import Weather from '../../functionalities/Weather.jsx'
import countries from "../../constants/countries.js";
import Currency from '../../functionalities/Currency.jsx';
import Language from '../../functionalities/Language.jsx';
import History from '../../functionalities/History.jsx';



const Home = () => {
  const { countryCode } = useParams();
  const { cityName } = useParams();

  const navigate = useNavigate();
  const [countryName, setCountryName] = useState('');
  const [localDate, setLocalDate] = useState('');
  const videoNumber = useMemo(() => Math.floor(Math.random() * 3) + 1, []);
  // Generate unique key for page refresh
  const videoKey = useMemo(() => Date.now(), []);
  


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
          <h1>{cityName}</h1>
          <p className="date">{localDate}</p>
        </header>
      
        <main>
  <div className="column left">

    <Weather 
            countryName={countryName}
            countryCode={countryCode}
    />  

    {countryCode != 'us' && <Currency 
      countryCode={countryCode} 
    />}

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
    <Language
    countryCode={countryCode} 
    />

    <History
    countryName={countryName}
    />

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