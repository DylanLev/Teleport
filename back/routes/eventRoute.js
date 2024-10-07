// eventRoute.js
import express from 'express';
import { getEvents } from '../config/telegram/telegramBot.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;