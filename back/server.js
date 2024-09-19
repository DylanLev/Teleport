import express from 'express';
import colors from 'colors';
import connectDB from './config/db.js';
import errorHandler from './middlewares/errorMiddleware.js';
import NodeCache from 'node-cache';
import {port} from "./config/config.js";
import axios from 'axios';
import cors from 'cors';
import currencyMap from './config/currencies.js';
import favoriteRoutes from './routes/favoriteRoute.js';
import noteRoutes from './routes/noteRoute.js';
import cron from 'node-cron';
import coordinates from "./config/coordinates.js";
import { telegramBotUri } from './config/config.js';  
import { getEvents,getGroups, initializeBot } from './config/telegram/telegramBot.js';

connectDB();
const app = express();



// Initialize cache
const cache = new NodeCache({ stdTTL: 24 * 60 * 60 }); // Cache for 24 hours

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/favorites', favoriteRoutes);
app.use('/api/notes', noteRoutes);


//---------------TELEGRAM API------------------
//Init
initializeBot();

//GET Events
app.get('/api/events', async (req, res) => {
  const events = await getEvents();
  res.json(events);
});
//----------------------------------------------
//GET Groups
app.get('/api/groups', async (req, res) => {
  const groups = await getGroups();
  res.json(groups);
});


// Function to fetch and cache weather data
const fetchAndCacheWeather = async (countryCode) => {
  try {
   
    const LATITUDE = coordinates[countryCode.toUpperCase()].lat;
    const LONGITUDE = coordinates[countryCode.toUpperCase()].lon;
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m&forecast_days=1`;
    const response = await axios.get(url);
  
    const weatherData = response.data;
    cache.set(`weather_${countryCode}`, { data: weatherData, timestamp: Date.now() });
    return weatherData;
  } catch (error) {
    console.error(`Error fetching weather for ${countryCode}:`, error);
    throw error; // Re-throw the error so it can be caught in the route handler
  }
};





// Function to fetch and cache news data
const fetchAndCacheNews = async (countryCode) => {
  try {
    //RAJOUTER published_on=2024-09-11 (la date d'auj) dans l'url ?
    const API_KEY = process.env.VITE_NEWS;
    const response = await axios.get(`https://api.thenewsapi.com/v1/news/top?api_token=${API_KEY}&locale=${countryCode}&language=en&categories=general&limit=3`);
    const newsData = response.data.data;
    cache.set(`news_${countryCode}`, { data: newsData, timestamp: Date.now() });
    return newsData;
  } catch (error) {
    console.error(`Error fetching news for ${countryCode}:`, error);
    return null;
  }
};

// Function to fetch and cache currency data
const fetchAndCacheCurrency = async (currencyCode) => {
  try {

    const API_URL = 'https://api.freecurrencyapi.com/v1/latest?';
    
    const API_KEY = process.env.VITE_CURRENCY_NEW;
    const response = await axios.get(`${API_URL}apikey=${API_KEY}&currencies=${currencyCode}`);
    const exchangeData = response.data;
    cache.set(`currency_${currencyCode}`, { data: exchangeData, timestamp: Date.now() });
    return exchangeData;
  } catch (error) {
    console.error(`Error fetching currency data for ${currencyCode}:`, error);
    return null;
  }
};

// Schedule jobs to refresh cache every 24 hours
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily cache refresh');
  const countryCodes = Object.keys(currencyMap);
  for (const code of countryCodes) {
    await fetchAndCacheNews(code);
    await fetchAndCacheCurrency(currencyMap[code]);
  }
});

// New route for fetching news
app.get('/api/news/:countryCode', async (req, res) => {
  const { countryCode } = req.params;
  const cacheKey = `news_${countryCode}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData && (Date.now() - cachedData.timestamp < 24 * 60 * 60 * 1000)) {
    return res.json(cachedData.data);
  }

  try {
    const newsData = await fetchAndCacheNews(countryCode);
    if (newsData) {
      res.json(newsData);
    } else {
      res.status(500).json({ error: 'Failed to fetch news' });
    }
  } catch (error) {
    console.error('Error in news route:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Route for currency exchange
app.get('/api/currency-exchange/:countryCode', async (req, res) => {
  const { countryCode } = req.params;
  const currencyCode = currencyMap[countryCode.toUpperCase()] || countryCode.toUpperCase();
  const cacheKey = `currency_${currencyCode}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData && (Date.now() - cachedData.timestamp < 24 * 60 * 60 * 1000)) {
    return res.json(cachedData.data);
  }

  try {
    const exchangeData = await fetchAndCacheCurrency(currencyCode);
    if (exchangeData) {
      res.json(exchangeData);
    } else {
      res.status(500).json({ error: 'Failed to fetch currency exchange data' });
    }
  } catch (error) {
    console.error('Error in currency exchange route:', error);
    res.status(500).json({ error: 'Failed to fetch currency exchange data' });
  }
});

app.get('/api/weather/:countryCode', async (req, res) => {
  const { countryCode } = req.params;
  const cacheKey = `weather_${countryCode}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData && (Date.now() - cachedData.timestamp < 24 * 60 * 60 * 1000)) {
    return res.json(cachedData.data);
  }

  try {
    const weatherData = await fetchAndCacheWeather(countryCode);
    res.json(weatherData);
  } catch (error) {
    console.error('Error in weather route:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
    }
    res.status(500).json({ error: 'Failed to fetch weather data', details: error.message });
  }
});

app.use(errorHandler);

// DEBUG
app.get('/api/cache-status', (req, res) => {
  const cacheKeys = cache.keys();
  const cacheContents = {};
  cacheKeys.forEach(key => {
    cacheContents[key] = cache.get(key);
  });
  res.json(cacheContents);
});

app.listen(port, () => console.log(`Server started on port ${port}`));


export { telegramBotUri };