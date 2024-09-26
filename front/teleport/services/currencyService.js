import axios from 'axios';

const API_URL = 'http://localhost:5000/api/currency-exchange';

export const fetchExchangeRate = async (countryCode) => {
  try {
    const response = await axios.get(`${API_URL}/${countryCode}`);
    const data = response.data;

    // Normalize the data structure
    if (data.data) {
      // First API format
      const currencyCode = Object.keys(data.data)[0];
      return {
        base_code: "USD",
        target_code: currencyCode,
        conversion_rate: data.data[currencyCode],
        time_last_update_utc: new Date().toUTCString()
      };
    } else if (data.base_code) {
      // Second API format
      return data;
    } else {
      throw new Error('Unexpected data format');
    }
  } catch (error) {
    console.error('Error in currencyService:', error);
    throw error;
  }
};