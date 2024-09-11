import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWeatherData } from '../../services/weatherService.js';

const Weather = ({ countryName, countryCode, cityName }) => {
  const { data: weatherData, isPending, error } = useQuery({
    queryKey: ['weather', countryCode, cityName],
    queryFn: () => fetchWeatherData(countryCode, cityName),
    enabled: !!countryCode && !!cityName
  });

  if (isPending) return <p>Loading weather data...</p>;
  if (error) return <p>Error loading weather data: {error.message}</p>;

  return (
    <section className="weather">
      <h2>Weather in {countryName} ({cityName})</h2>
      {weatherData && (
        <div>
          <p>Temperature: {weatherData.temp}°C</p>
          <p>Description: {weatherData.weather.description}</p>
          <img src={`https://www.weatherbit.io/static/img/icons/${weatherData.weather.icon}.png`} alt="Weather icon" />
          <p>Wind Speed: {weatherData.wind_spd.toFixed(1)} m/s</p>
          <p>Humidity: {weatherData.rh}%</p>
        </div>
      )}
    </section>
  );
};

export default Weather;