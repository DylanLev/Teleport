const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const colors = require("colors");
const connectDB = require('./config/db.js');
const {errorHandler} = require('./middlewares/errorMiddleware');
const NodeCache = require('node-cache');
const axios = require('axios');
const cors = require('cors');



// Your existing routes and middleware go here

connectDB();
const app = express();

// Initialize cache
const cache = new NodeCache({ stdTTL: 24 * 60 * 60 }); // Cache for 24 hours

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/favorites', require('./routes/favoriteRoute.js'));
app.use('/api/notes', require('./routes/noteRoute.js'));

// New route for fetching news
app.get('/api/news/:countryCode', async (req, res) => {
  const { countryCode } = req.params;
  
  // Check if data is in cache
  const cachedData = cache.get(countryCode);
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    // If not in cache, fetch from API
    const API_KEY = process.env.VITE_NEWS;
    const response = await axios.get(`https://api.thenewsapi.com/v1/news/top?api_token=${API_KEY}&locale=${countryCode}&limit=3`);
    const newsData = response.data.data;

    // Store in cache
    cache.set(countryCode, newsData);

    res.json(newsData);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.use(errorHandler);

app.listen(port, ()=> console.log(`Server started on port ${port}`))