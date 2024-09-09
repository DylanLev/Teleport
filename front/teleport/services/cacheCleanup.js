// src/services/cacheCleanup.js

import cron from 'node-cron';
import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), 'cache');

const cleanupCache = () => {
  if (fs.existsSync(CACHE_DIR)) {
    const files = fs.readdirSync(CACHE_DIR);
    for (const file of files) {
      fs.unlinkSync(path.join(CACHE_DIR, file));
    }
    console.log('Cache cleaned up');
  }
};

// Execute everyday at midnight
cron.schedule('0 0 * * *', cleanupCache);