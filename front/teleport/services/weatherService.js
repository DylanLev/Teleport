import countries from "../src/constants/countries.js";

const API_KEY = import.meta.env.VITE_WEATHER;

export const getCityFromTimezone = (timezone) => {
  return timezone.split('/').pop().replace(/_/g, ' ');
};

export const fetchWeatherData = async (countryCode, cityName) => {
  const url = `https://api.weatherbit.io/v2.0/current?key=${API_KEY}&city=${encodeURIComponent(cityName)}&country=${countryCode}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.data && data.data.length > 0) {
      return data.data[0];
    } else {
      throw new Error("No weather data found");
    }
  } catch (error) {
    console.error("Error in retrieving weather data:", error);
    throw error;
  }
};