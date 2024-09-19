import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "./getStarted.scss";
import influencersData from "../../components/scrollbar/influencers.json";
import Map from "../../components/map/Map.jsx";
import Events from "../../functionalities/Events.jsx";
import CitySelector from '../../functionalities/CitySelector.jsx'; 

const GetStarted = () => {
  const [selectedContinent, setSelectedContinent] = useState(null);
  const { influencers } = influencersData;
  const navigate = useNavigate();

  const scrollRefs = {
    influencers: useRef(null),
    groups: useRef(null),
    accommodations: useRef(null),
    topics: useRef(null)
  };

  const handleInfluencerClick = (influencer) => {
    navigate('/influencer', { state: { influencer } });
  };

  const continents = ['Europe', 'Asia', 'North America', 'South America', 'Africa', 'Australia'];
  
  const cities = {
    'Europe': ['Marbella', 'Paris', 'London'],
    'Asia': ['Dubai', 'Tokyo', 'Singapore', "Shanghai"],
    'North America': ['New York', 'Los Angeles', 'Miami'],
    'South America': ['Rio de Janeiro', 'Buenos Aires', 'Cartagena'],
    'Africa': ['Cape Town', 'Marrakech', 'Zanzibar'],
    'Australia': ['Sydney', 'Melbourne', 'Gold Coast']
  };

  const groups = [
    { name: 'Tech Entrepreneurs', platform: 'Telegram' },
    { name: 'Digital Nomads', platform: 'Telegram' },
    { name: '[Free] Udemy Courses', platform: 'Telegram' },
    { name: 'Luxury Travel', platform: 'Telegram' }
  ];

  const luxuryAccommodations = [
    { name: 'Burj Al Arab', location: 'Dubai', type: 'Hotel' },
    { name: 'Villa La Zagaleta', location: 'Marbella', type: 'Villa' },
    { name: 'The Ritz', location: 'Paris', type: 'Hotel' }
  ];

  const trendingTopics = ['AI', 'Dropshipping', 'E-commerce', 'MMA', 'Cryptocurrency'];

  const scrollContent = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 200;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="get-started">
      <div className="main-content">
        <h1>What exciting events are around the globe?</h1>
        <Map/>

        <Events/>

        <CitySelector continents={continents} cities={cities} />
        </div>

      <div className="scroll-widgets">
        <div className="scroll-widget">
          <h2>Exclusive Groups</h2>
          <div className="scroll-container" ref={scrollRefs.groups}>
            {groups.map(group => (
              <div key={group.name} className="group-card">
                <h4>{group.name}</h4>
                <p>Join on {group.platform}</p>
              </div>
            ))}
          </div>
          <button onClick={() => scrollContent(scrollRefs.groups, 'left')} className="scroll-button left">←</button>
          <button onClick={() => scrollContent(scrollRefs.groups, 'right')} className="scroll-button right">→</button>
        </div>

        <div className="scroll-widget">
          <h2>Recommended by</h2>
          <div className="scroll-container" ref={scrollRefs.accommodations}>
            {luxuryAccommodations.map(accommodation => (
              <div key={accommodation.name} className="accommodation-card">
                <h4>{accommodation.name}</h4>
                <p>Location: {accommodation.location}</p>
                <p>Type: {accommodation.type}</p>
              </div>
            ))}
          </div>
          <button onClick={() => scrollContent(scrollRefs.accommodations, 'left')} className="scroll-button left">←</button>
          <button onClick={() => scrollContent(scrollRefs.accommodations, 'right')} className="scroll-button right">→</button>
        </div>

        <div className="scroll-widget">
          <h2>Trending</h2>
          <div className="scroll-container" ref={scrollRefs.topics}>
            {trendingTopics.map(topic => (
              <div key={topic} className="topic-card">
                <h4>{topic}</h4>
              </div>
            ))}
          </div>
          <button onClick={() => scrollContent(scrollRefs.topics, 'left')} className="scroll-button left">←</button>
          <button onClick={() => scrollContent(scrollRefs.topics, 'right')} className="scroll-button right">→</button>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;