import words from "../src/constants/words.json";
import definitions from "../src/constants/definitions.json";

const getRandomWords = (date, language, count = 5) => {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()*5;
  
  // Check if the language is English
  if (language === 'en') {
    const allDefinitions = Object.keys(definitions);
    const selectedDefinitions = [];

    for (let i = 0; i < count; i++) {
      const index = (seed + i) % allDefinitions.length;
      const word = allDefinitions[index];
      selectedDefinitions.push({
        original: word,
        translated: definitions[word].definition
      });
    }

    return selectedDefinitions;
  } else {
    // Existing code for non-English languages
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
  }
};

const getLanguageByCountry = (countryCode) => {
  const languageMap = {
    FR: 'fr', JP: 'ja', BR: 'pt', AU: 'en', EG: 'ar',
    CA: 'en', DE: 'de', IN: 'hi', IT: 'it', MX: 'es',
    ZA: 'en', ES: 'es', GB: 'en', US: 'en', CN: 'zh',
    RU: 'ru', AR: 'es', NL: 'nl', SE: 'sv', CH: 'de',
    KR: 'ko', PT: 'pt', GR: 'el', TR: 'tr', NZ: 'en',
    IL: 'he', AE: 'ar', SG: 'en', PE: 'es', MA: 'ar',
    CZ: 'cz', AT: 'de', HR: 'hr', RO: 'ro', TH: 'th',
    HK: 'zh', ID: 'id', VN: 'vi', CL: 'es', CO: 'es',
    TZ: 'en', KE: 'en', GH: 'en', SN: 'fr'
  };
  countryCode = countryCode.toUpperCase();
  return languageMap[countryCode] || 'en'; // Default to English if not found
};

export { getRandomWords, getLanguageByCountry };