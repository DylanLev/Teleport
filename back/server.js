// import express from 'express';
// import dotenv from 'dotenv';
// import colors from 'colors';
// import connectDB from './config/db.js';
// import errorHandler from './middlewares/errorMiddleware.js';
// import NodeCache from 'node-cache';
// import axios from 'axios';
// import cors from 'cors'
// import currencyMap from './config/currencies.js';
// import favoriteRoutes from './routes/favoriteRoute.js';
// import noteRoutes from './routes/noteRoute.js';


// dotenv.config();
// const port = process.env.PORT;

// connectDB();
// const app = express();

// // Initialize cache
// const cache = new NodeCache({ stdTTL: 24 * 60 * 60 }); // Cache for 24 hours

// // Enable CORS for all routes
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({extended: false}));

// app.use('/api/favorites', favoriteRoutes);
// app.use('/api/notes', noteRoutes);

// //-------------------------------------------------------------------------
// // New route for fetching news
// app.get('/api/news/:countryCode', async (req, res) => {
//   const { countryCode } = req.params;
  
//   // Check if data is in cache
//   const cachedData = cache.get(`news_${countryCode}`);
//   if (cachedData) {
//     return res.json(cachedData);
//   }

//   try {
//     // If not in cache, fetch from API
//     const API_KEY = process.env.VITE_NEWS;
//     const response = await axios.get(`https://api.thenewsapi.com/v1/news/top?api_token=${API_KEY}&locale=${countryCode}&language=en&categories=general&limit=3`);
//     const newsData = response.data.data;

//     // Store in cache
//     cache.set(`news_${countryCode}`, newsData);


//     res.json(newsData);
//   } catch (error) {
//     console.error('Error fetching news:', error);
//     res.status(500).json({ error: 'Failed to fetch news' });
//   }
// });
// //------------------------------------------------------------------
// app.get('/api/currency-exchange/:countryCode', async (req, res) => {
//   const { countryCode } = req.params;
  
//   // Convert country code to currency code
//   const currencyCode = currencyMap[countryCode.toUpperCase()] || countryCode.toUpperCase();

//   // Check if data is in cache
//   const cacheKey = `currency_${currencyCode}`;
//   const cachedData = cache.get(cacheKey);
//   if (cachedData) {
//     return res.json(cachedData);
//   }

//   try {
//     const API_URL = 'https://api.freecurrencyapi.com/v1/latest?';
//     const API_KEY = process.env.VITE_CURRENCY_NEW;
//     const response = await axios.get(`${API_URL}apikey=${API_KEY}&currencies=${currencyCode}`);
//     const exchangeData = response.data;

//     // Store in cache
//     cache.set(cacheKey, exchangeData);

//     res.json(exchangeData);
//   } catch (error) {
//     console.error('Error fetching currency exchange data:', error);
//     res.status(500).json({ error: 'Failed to fetch currency exchange data' });
//   }
// });
// //-------------------------------------------------------------------------------------
// app.use(errorHandler);
// //----------------------
// //DEBUG
// app.get('/api/cache-status', (req, res) => {
//   const cacheKeys = cache.keys();
//   const cacheContents = {};
//   cacheKeys.forEach(key => {
//     cacheContents[key] = cache.get(key);
//   });
//   res.json(cacheContents);
// });

// app.listen(port, ()=> console.log(`Server started on port ${port}`))

import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import errorHandler from './middlewares/errorMiddleware.js';
import NodeCache from 'node-cache';
import axios from 'axios';
import cors from 'cors';
import currencyMap from './config/currencies.js';
import favoriteRoutes from './routes/favoriteRoute.js';
import noteRoutes from './routes/noteRoute.js';
import cron from 'node-cron';

dotenv.config();
const port = process.env.PORT;

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

// Function to fetch and cache news data
const fetchAndCacheNews = async (countryCode) => {
  try {
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