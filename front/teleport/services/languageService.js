import words from "../src/constants/words.json";

const getRandomWords = (date, language, count = 3) => {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const allWords = Object.keys(words);
  const selectedWords = [];

  for (let i = 0; i < count; i++) {
    const index = (seed + i) % allWords.length;
    const word = allWords[index];
    selectedWords.push({
      original: word,
      translated: words[word][language] || "Translation not available"
    });
  }

  return selectedWords;
};

const getLanguageByCountry = (countryCode) => {
  // This is a simplified mapping. You might need a more comprehensive one.
  const languageMap = {
    FR: 'fr', JP: 'ja', BR: 'pt', AU: 'en', EG: 'ar',
    CA: 'en', DE: 'de', IN: 'hi', IT: 'it', MX: 'es',
    ZA: 'en', ES: 'es', GB: 'en', US: 'en', CN: 'zh',
    RU: 'ru', AR: 'es', NL: 'nl', SE: 'sv', CH: 'de',
    KR: 'ko', PT: 'pt', GR: 'el', TR: 'tr', NZ: 'en',
    IL: 'he'
  };
  return languageMap[countryCode] || 'en'; // Default to English if not found
};

export { getRandomWords, getLanguageByCountry };