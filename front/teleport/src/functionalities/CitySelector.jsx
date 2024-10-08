import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from '../functionalities/CitySelector.module.scss';
import cityToCountryCode from '../constants/cityToCountryCode.js';

const CitySelector = ({ continents, cities }) => {
  const navigate = useNavigate();
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const continentOptions = useMemo(() => 
    continents.map(continent => ({ value: continent, label: continent })),
    [continents]
  );

  const filteredCities = useMemo(() => {
    if (!selectedContinent) return [];
    return cities[selectedContinent.value].filter(city => 
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedContinent, cities, searchTerm]);

  const handleCityClick = (city) => {
    const countryCode = cityToCountryCode[city] || 'unknown';
    navigate(`/home/view/${countryCode}/${city}`);
  };

  return (
    <div className={styles.citySelector}>
      <div className={styles.controls}>
        <Select
          options={continentOptions}
          onChange={setSelectedContinent}
          value={selectedContinent}
          placeholder="Select a continent"
          className={styles.continentSelect}
          classNamePrefix="react-select"
        />
        <input
          type="text"
          placeholder="Search cities"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      
      <motion.div 
        className={styles.cityGrid}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filteredCities.map(city => (
          <motion.div 
            key={city} 
            className={styles.cityCard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCityClick(city)}
          >
            <img 
              src={`/cityimages/${city.toLowerCase().replace(/ /g, '-')}.jpg`}              
              alt={city} 
              loading="lazy"
            />
            <h3>{city}</h3>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CitySelector;