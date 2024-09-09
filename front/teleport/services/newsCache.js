// src/services/newsCache.js

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const cleanupCache = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('news_')) {
      const cachedData = localStorage.getItem(key);
      const { timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp >= CACHE_DURATION) {
        localStorage.removeItem(key);
      }
    }
  }
};

export const getCachedNews = (countryCode) => {
  cleanupCache(); // Run cleanup each time we try to get cached news
  
  const cacheKey = `news_${countryCode}`;
  const cachedData = localStorage.getItem(cacheKey);
  
  if (cachedData) {
    const { timestamp, data } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    } else {
      localStorage.removeItem(cacheKey); // Remove expired data
    }
  }
  
  return null;
};

export const setCachedNews = (countryCode, newsData) => {
  const cacheKey = `news_${countryCode}`;
  const cacheContent = JSON.stringify({
    timestamp: Date.now(),
    data: newsData
  });
  
  localStorage.setItem(cacheKey, cacheContent);
};