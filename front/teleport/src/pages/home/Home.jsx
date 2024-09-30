import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Home.scss';
import News from '../../functionalities/News.jsx';
import Weather from '../../functionalities/Weather.jsx'
import countries from "../../constants/countries.js";
import Currency from '../../functionalities/Currency.jsx';
import Language from '../../functionalities/Language.jsx';
import Tech from '../../functionalities/Tech.jsx';
import { getLanguageByCountry } from '../../../services/languageService.js';
import Crypto from '../../functionalities/Crypto.jsx';


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

   // Determine the correct timezone
   let timezone;
   if (code === 'US' && cityName && country.timezones) {
     timezone = country.timezones[cityName] || country.timezones['New York']; // Default to New York if city not found
   } else {
     timezone = country.timezone;
   }

    // Set local date and time based on country's timezone
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: timezone,
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

  const nonewscountries = (countryCode)=> {
    const noNewsCountries = ['fr', 'ke', 'ma', 'ae', 'at', 'id','ar'];
    return noNewsCountries.includes(countryCode.toLowerCase());
  };
  const noenglishlanguage = (countryCode) => {
    return getLanguageByCountry(countryCode) !== 'en';

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

    {!nonewscountries(countryCode) && <Crypto/>
    }
  </div>

  <div className="column center">
  {nonewscountries(countryCode) ? <Tech/>: (
  <News 
    countryName={countryName}
    countryCode={countryCode}
  />
  )}
    
    <section className="nothing">
      <h2>nothing yet</h2>
      
    </section>

    <section className="music">
      <h2>Spotify Top Tracks in {countryName}</h2>
      {/* Spotify API content specific to the country */}
    </section>
  </div>

  <div className="column right">
    {noenglishlanguage(countryCode) && <Language
    countryCode={countryCode} 
    />}

    {!nonewscountries(countryCode) && <Tech
    />}

    {nonewscountries(countryCode) && <Crypto/>}
  </div>
</main>
      </div>
    </>
  );
};



export default Home;