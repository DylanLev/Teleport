// config.js
import dotenv from 'dotenv';
dotenv.config();

export const telegramBotUri = process.env.TELEGRAMBOT;
export const port = process.env.PORT;
