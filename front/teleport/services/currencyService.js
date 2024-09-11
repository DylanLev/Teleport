// import axios from 'axios';
// import currencyMap from '../../../back/config/currencies.js';
// const API_URL = 'http://localhost:5000/api/currency-exchange';

// function getCurrencyCode(countryCode) {
//     return currencyMap[countryCode.toUpperCase()] || 'Unknown';
//   }

// export const fetchExchangeRate = async (countryCode) => {
//   try {
//     const currencyCode = getCurrencyCode(countryCode);
//     const response = await axios.get(`${API_URL}/${currencyCode}`);
//     console.log(response);
//     return response.data;
//   } catch (error) {
//     console.error('Error in currencyService:', error);
//     throw error;
//   }
// };
import axios from 'axios';
import currencyMap from '../../../back/config/currencies.js';

const API_URL = 'https://continentl.com/api/currency-exchange-details';
const API_KEY = import.meta.env.VITE_CURRENCY;

function getCurrencyCode(countryCode) {
  return currencyMap[countryCode.toUpperCase()] || 'Unknown';
}

export const fetchExchangeRate = async (countryCode) => {
  try {
    const currencyCode = getCurrencyCode(countryCode);
    const response = await axios.get(`${API_URL}/${currencyCode}?key=${API_KEY}`);
    return response.data;
  } catch (error) {
    console.error('Error in currencyService:', error);
    throw error;
  }
};