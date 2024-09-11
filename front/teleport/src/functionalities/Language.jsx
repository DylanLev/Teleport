import React, { useState, useEffect } from 'react';
import { getRandomWords, getLanguageByCountry } from "../../services/languageService.js";

const Language = ({ countryCode }) => {
  const [dailyWords, setDailyWords] = useState([]);
  const language = getLanguageByCountry(countryCode);

  useEffect(() => {
    const today = new Date();
    const words = getRandomWords(today, language);
    setDailyWords(words);
  }, [countryCode, language]);

  return (
    <section className="language">
      <h2>Learn {language.toUpperCase()}</h2>
      <ul>
        {dailyWords.map((word, index) => (
          <li key={index}>
            {word.original}: {word.translated}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Language;