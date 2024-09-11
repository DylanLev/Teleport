import axios from 'axios';

const API_URL = 'http://localhost:5000/api/currency-exchange';

export const fetchExchangeRate = async (countryCode) => {
  try {
    const response = await axios.get(`${API_URL}/${countryCode}`);
    return response.data;
  } catch (error) {
    console.error('Error in currencyService:', error);
    throw error;
  }
};