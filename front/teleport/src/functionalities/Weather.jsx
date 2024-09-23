import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import weatherCodes from '../constants/weathercodes.js';
import { useParams } from 'react-router';

const Weather = () => {
  const {cityName} = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWeather = useCallback(async () => {
    if (!cityName) {
      console.log('No city name provided');
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/weather/${cityName}`, {
        timeout: 5000 // 5 seconds timeout
      });
      setWeatherData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load weather data');
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, [cityName]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const getCurrentWeather = useCallback(() => {
    if (!weatherData || !weatherData.hourly) return null;
    const lastIndex = weatherData.hourly.time.length - 1;
    return {
      temperature: weatherData.hourly.temperature_2m[lastIndex],
      apparentTemperature: weatherData.hourly.apparent_temperature[lastIndex],
      precipitationProbability: weatherData.hourly.precipitation_probability[lastIndex],
      weatherCode: weatherData.hourly.weather_code[lastIndex],
      windSpeed: weatherData.hourly.wind_speed_10m[lastIndex],
    };
  }, [weatherData]);

  const current = useMemo(() => getCurrentWeather(), [getCurrentWeather]);

  const getWeatherDescription = useCallback((code) => {
    return weatherCodes[code] || "Unknown";
  }, []);

  const getWeatherEmoji = useCallback((code) => {
    const emojiMap = {
      0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️", 45: "🌫️", 48: "🌫️", 51: "🌦️", 53: "🌦️", 55: "🌧️",
      56: "🌨️", 57: "🌨️", 61: "🌧️", 63: "🌧️", 65: "🌧️", 66: "🌨️", 67: "🌨️", 71: "🌨️",
      73: "🌨️", 75: "❄️", 77: "❄️", 80: "🌦️", 81: "🌧️", 82: "🌧️", 85: "🌨️", 86: "❄️",
      95: "⛈️", 96: "⛈️", 99: "⛈️"
    };
    return emojiMap[code] || "❓";
  }, []);

  if (error) return <p className="weather-error">{error}</p>;
  if (isLoading) return <p className="weather-loading">Loading weather data...</p>;
  if (!current) return <p className="weather-unavailable">No weather data available.</p>;

  return (
    <section className="weather">
      <h2>Weather in {cityName}</h2>
      <p>Temperature: {current.temperature.toFixed(1)}°C</p>
      <p>Feels like: {current.apparentTemperature.toFixed(1)}°C</p>
      <p>Weather: {getWeatherEmoji(current.weatherCode)} {getWeatherDescription(current.weatherCode)}</p>
      <p>Wind speed: {current.windSpeed.toFixed(1)} km/h</p>
    </section>
  );
};

export default React.memo(Weather);