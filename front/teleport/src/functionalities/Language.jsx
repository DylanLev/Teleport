import React, { useState, useEffect } from 'react';
import { getRandomWords, getLanguageByCountry } from "../../services/languageService.js";
import languages from "../constants/languages.js";

const Language = ({ countryCode }) => {
  const [dailyWords, setDailyWords] = useState([]);
  const language = getLanguageByCountry(countryCode);
  
  useEffect(() => {
    const today = new Date();
    const words = getRandomWords(today, language);
    setDailyWords(words);
  }, [countryCode, language]);

  // Helper function to get the main language of a country (simplified)
  function getLanguage(countryCode) {
    if (!countryCode) return 'the local language';
    
    const code = countryCode.toUpperCase();
    
    return languages[code] || 'the local language';
  }
  
  return (
    <section className="language">
      <h2>
        {`Learn ${getLanguage(countryCode)}`}
      </h2>
      <ul>
        {dailyWords.map((word, index) => (
          <li key={index}>
            <strong>{word.original}:</strong> {word.translated}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Language;