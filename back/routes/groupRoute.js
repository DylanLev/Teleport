// groupRoute.js
import express from 'express';
import { getGroups } from '../config/telegram/telegramBot.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const groups = await getGroups();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;