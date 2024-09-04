import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Home.scss';

const Home = () => {
  const { id, countryCode } = useParams();
  const navigate = useNavigate();
  const [countryName, setCountryName] = useState('');
  const [localDate, setLocalDate] = useState('');
  const videoNumber = useMemo(() => Math.floor(Math.random() * 3) + 1, []);
  // generate unique key for page refresh
  const videoKey = useMemo(() => Date.now(), []);

  useEffect(() => {
    if (!id || !countryCode) {
      navigate('/');
      return;
    }

    const code = countryCode.toUpperCase();

    const countries = {
      FR: { name: 'France', timezone: 'Europe/Paris' },
      JP: { name: 'Japan', timezone: 'Asia/Tokyo' },
      BR: { name: 'Brazil', timezone: 'America/Sao_Paulo' },
      AU: { name: 'Australia', timezone: 'Australia/Sydney' },
      EG: { name: 'Egypt', timezone: 'Africa/Cairo' },
      CA: { name: 'Canada', timezone: 'America/Toronto' },
      DE: { name: 'Germany', timezone: 'Europe/Berlin' },
      IN: { name: 'India', timezone: 'Asia/Kolkata' },
      IT: { name: 'Italy', timezone: 'Europe/Rome' },
      MX: { name: 'Mexico', timezone: 'America/Mexico_City' },
      ZA: { name: 'South Africa', timezone: 'Africa/Johannesburg' },
      ES: { name: 'Spain', timezone: 'Europe/Madrid' },
      GB: { name: 'United Kingdom', timezone: 'Europe/London' },
      US: { name: 'United States', timezone: 'America/New_York' },
      CN: { name: 'China', timezone: 'Asia/Shanghai' },
      RU: { name: 'Russia', timezone: 'Europe/Moscow' },
      AR: { name: 'Argentina', timezone: 'America/Argentina/Buenos_Aires' },
      NL: { name: 'Netherlands', timezone: 'Europe/Amsterdam' },
      SE: { name: 'Sweden', timezone: 'Europe/Stockholm' },
      CH: { name: 'Switzerland', timezone: 'Europe/Zurich' },
      KR: { name: 'South Korea', timezone: 'Asia/Seoul' },
      PT: { name: 'Portugal', timezone: 'Europe/Lisbon' },
      GR: { name: 'Greece', timezone: 'Europe/Athens' },
      TR: { name: 'Turkey', timezone: 'Europe/Istanbul' },
      NZ: { name: 'New Zealand', timezone: 'Pacific/Auckland' },
      IL: { name: 'Israel', timezone: 'Asia/Jerusalem' }
    };



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

  }, [id, countryCode, navigate]);

  if (!id || !countryCode) {
    return null;
  }

  return (
    <>
      <video key={videoKey} className="background-video" autoPlay loop muted playsInline loading="lazy">
        <source src={`/../../backgroundvideos/${countryCode.toUpperCase()}/${countryCode.toUpperCase()}${videoNumber}.mp4`} type="video/mp4" />
      </video>
      <div className="video-overlay"></div>
      <div className="home">
        <header>
          <h1>{countryName}</h1>
          <p className="date">{localDate}</p>
        </header>
      
      <main>
        <div className="column left">
          <section className="weather">
            <h2>Weather in {countryName}</h2>
            {/* Weather API content specific to the country */}
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
          <section className="news">
            <h2>Current Events in {countryName}</h2>
            {/* News content specific to the country */}
          </section>

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
    CA: 'English', DE: 'German', IN: 'Hindi', IT: 'Italian', MX: 'Spanish',
    ZA: 'Afrikaans', ES: 'Spanish', GB: 'English', US: 'English',
    CN: 'Chinese', RU: 'Russian', AR: 'Spanish', NL: 'Dutch', SE: 'Swedish',
    CH: 'Multiple languages', KR: 'Korean', PT: 'Portuguese', GR: 'Greek',
    TR: 'Turkish', NZ: 'English', IL: 'Hebrew'
  };
  return languages[code] || 'the local language';
}

export default Home;