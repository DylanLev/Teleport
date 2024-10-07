// topicRoute.js
import express from 'express';
import { getTopics } from '../config/telegram/telegramBot.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const topics = await getTopics();
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;