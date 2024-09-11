import React, { useEffect, useState } from 'react';
import axios from 'axios';
import weatherCodes from '../constants/weathercodes.js';

const Weather = ({ countryName, countryCode, cityName  }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      if (countryCode) {
        setIsLoading(true);
        try {
          const response = await axios.get(`http://localhost:5000/api/weather/${countryCode}`);
          setWeatherData(response.data);
          setError(null);
        } catch (err) {
          console.error('Error fetching weather data:', err);
          setError('Failed to load weather data');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchWeather();
  }, [countryCode]);

  if (error) {
    return <p>{error}</p>;
  }

  if (isLoading) {
    return <p>Loading weather data...</p>;
  }

  if (!weatherData || !weatherData.hourly) {
    return <p>No weather data available.</p>;
  }

  const getCurrentWeather = () => {
    return {
      temperature: weatherData.hourly.temperature_2m[weatherData.hourly.temperature_2m.length - 1],
      apparentTemperature: weatherData.hourly.apparent_temperature[weatherData.hourly.apparent_temperature.length - 1],
      precipitationProbability: weatherData.hourly.precipitation_probability[weatherData.hourly.precipitation_probability.length - 1],
      weatherCode: weatherData.hourly.weather_code[weatherData.hourly.weather_code.length - 1],
      windSpeed: weatherData.hourly.wind_speed_10m[weatherData.hourly.wind_speed_10m.length - 1],
    };
  };

  const current = getCurrentWeather();

  const getWeatherDescription = (code) => {
    return weatherCodes[code] || "Unknown";
  };

  const getWeatherEmoji = (code) => {
    const emojiMap = {
      0: "☀️", // Clear sky
      1: "🌤️", // Mainly clear
      2: "⛅", // Partly cloudy
      3: "☁️", // Overcast
      45: "🌫️", // Fog
      48: "🌫️", // Depositing rime fog
      51: "🌦️", // Light drizzle
      53: "🌦️", // Moderate drizzle
      55: "🌧️", // Dense drizzle
      56: "🌨️", // Light freezing drizzle
      57: "🌨️", // Dense freezing drizzle
      61: "🌧️", // Slight rain
      63: "🌧️", // Moderate rain
      65: "🌧️", // Heavy rain
      66: "🌨️", // Light freezing rain
      67: "🌨️", // Heavy freezing rain
      71: "🌨️", // Slight snow fall
      73: "🌨️", // Moderate snow fall
      75: "❄️", // Heavy snow fall
      77: "❄️", // Snow grains
      80: "🌦️", // Slight rain showers
      81: "🌧️", // Moderate rain showers
      82: "🌧️", // Violent rain showers
      85: "🌨️", // Slight snow showers
      86: "❄️", // Heavy snow showers
      95: "⛈️", // Thunderstorm
      96: "⛈️", // Thunderstorm with slight hail
      99: "⛈️", // Thunderstorm with heavy hail
    };
    return emojiMap[code] || "❓";
  };

  return (
    <section className="weather">
      <h2>Weather in {countryName} ({cityName})</h2>
      <p>Temperature: {current.temperature.toFixed(1)}°C</p>
      <p>Feels like: {current.apparentTemperature.toFixed(1)}°C</p>
      <p>Weather: {getWeatherEmoji(current.weatherCode)} {getWeatherDescription(current.weatherCode)}</p>
      <p>Wind speed: {current.windSpeed.toFixed(1)} km/h</p>
    </section>
  );
};

export default Weather;