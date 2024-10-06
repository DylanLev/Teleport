import express from 'express';
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
import { getEvents,getGroups,getTopics, initializeBot } from './config/telegram/telegramBot.js';
import supportedCurrencies from '../front/teleport/src/constants/supportedCurrencies.js';

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
//GET Topics
app.get('/api/topics', async (req, res) => {
  const topics = await getTopics();
  res.json(topics);
});


// Function to fetch and cache weather data
const fetchAndCacheWeather = async (city) => {
  try {
    const cityData = coordinates.find(item => item.city.toLowerCase() === city.toLowerCase());

    if (!cityData) {
      throw new Error(`City "${city}" not found in coordinates data`);
    }

    const url = `https://api.open-meteo.com/v1/forecast`;
    const params = {
      latitude: cityData.lat,
      longitude: cityData.lon,
      hourly: 'temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m',
      forecast_days: 1
    };

    const response = await axios.get(url, { params, timeout: 5000 });
    
    const weatherData = response.data;
    cache.set(`weather_${city.toLowerCase()}`, weatherData);
    return weatherData;
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error.message);
    throw error;
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

// Function to fetch and cache currency data (5000CALLS/MONTH)
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

//fetch currency 2nd API (for AED, etc 1500CALLS/MONTH)
const fetchAndCacheCurrency2 = async (currencyCode) => {
  try {
    const API_URL = 'https://v6.exchangerate-api.com';
    const API_KEY = process.env.VITE_CURRENCY_NEW2;
    const response = await axios.get(`${API_URL}/v6/${API_KEY}/latest/USD`);
    const exchangeData = response.data;

    if (exchangeData.result === "success" && exchangeData.conversion_rates[currencyCode]) {
      const targetRate = exchangeData.conversion_rates[currencyCode];
      const simplifiedData = {
        base_code: "USD",
        target_code: currencyCode,
        conversion_rate: targetRate,
        time_last_update_utc: exchangeData.time_last_update_utc
      };
      cache.set(`currency_${currencyCode}`, { data: simplifiedData, timestamp: Date.now() });
      return simplifiedData;
    } else {
      throw new Error(`Currency code ${currencyCode} not found in the response`);
    }
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
    await fetchAndCacheCurrency2(currencyMap[code]);

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
    let exchangeData;

    if (supportedCurrencies.includes(currencyCode)) {
      try {
        exchangeData = await fetchAndCacheCurrency(currencyCode);
      } catch (error) {
        console.error('Error with primary API, falling back to secondary:', error);
        exchangeData = await fetchAndCacheCurrency2(currencyCode);
      }
    } else {
      exchangeData = await fetchAndCacheCurrency2(currencyCode);
    }

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

// Express route handler
app.get('/api/weather/:city', async (req, res) => {
  const city = req.params.city.toLowerCase();
  const cacheKey = `weather_${city}`;

  try {
    let weatherData = cache.get(cacheKey);

    if (!weatherData) {
      weatherData = await fetchAndCacheWeather(city);
    }

    res.json(weatherData);
  } catch (error) {
    console.error('Error in weather route:', error.message);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Response error:', error.response.data);
        res.status(error.response.status).json({ 
          error: 'External API error', 
          details: error.response.data 
        });
      } else if (error.request) {
        console.error('Request error:', error.request);
        res.status(503).json({ 
          error: 'Unable to reach weather service', 
          details: 'The request was made but no response was received' 
        });
      } else {
        console.error('Error', error.message);
        res.status(500).json({ 
          error: 'Unexpected error', 
          details: error.message 
        });
      }
    } else {
      res.status(500).json({ 
        error: 'Internal server error', 
        details: error.message 
      });
    }
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