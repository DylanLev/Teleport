import React from 'react';

const History = ({ countryName }) => {
  const URL = 'https://www.britannica.com/place/';
  
  // Function to format the country name for the URL
  const formatCountryNameForURL = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  const formattedCountryName = formatCountryNameForURL(countryName);
  
  return (
    <section className="history">
      <h2>
        <a href={`${URL}${formattedCountryName}`} target="_blank" rel="noopener noreferrer">
          {countryName}'s History
        </a>
      </h2>
    </section>
  );
};

export default History;