import TelegramBot from "node-telegram-bot-api";
import { validateDate, formatDate } from '../date.js'; 
import { telegramBotUri } from '../config.js';  // Adjust the path as necessary
import Event from '../../models/eventModel.js';

//------------TELEGRAM API--------------------------
const bot = new TelegramBot(telegramBotUri, { polling: true });

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const commands = [
    '- Create a new event: /createevent City/Description/DDMMYYYY\n',
    '- Delete an existing event: /deleteevent City/Exact Description\n'
    // Add all your other commands here
  ];

  const helpMessage = 'Available commands:\n\n' + commands.join('\n');
  bot.sendMessage(chatId, helpMessage);
});



//Create event
bot.onText(/\/createevent (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const eventData = match[1].split('/');
    if (eventData.length === 3) {
      const [city, description, date] = eventData;
      
      if (!validateDate(date)) {
        bot.sendMessage(chatId, 'Invalid date format. Please use DDMMYY.');
        return;
      }
  
      const formattedDate = formatDate(date);
      
      try {
        const newEvent = new Event({ city, description, date: formattedDate });
        await newEvent.save();
        bot.sendMessage(chatId, 'Event created successfully!');
        console.log('New event created:', newEvent);
      } catch (error) {
        console.error('Error creating event:', error);
        bot.sendMessage(chatId, 'Error creating event. Please try again.');
      }
    } else {
      bot.sendMessage(chatId, 'Invalid format. Please use: /createevent City/Description/DDMMYY');
    }
  });



// Delete event
bot.onText(/\/deleteevent (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const deleteData = match[1].split('/');
    if (deleteData.length === 2) {
      const [city, description] = deleteData.map(item => item.trim());
      
      try {
        const deletedEvent = await Event.findOneAndDelete({
          city: { $regex: new RegExp(city, 'i') },
          description: { $regex: new RegExp(description, 'i') }
        });
  
        if (deletedEvent) {
          bot.sendMessage(chatId, `Event deleted successfully: ${deletedEvent.city} - ${deletedEvent.description} on ${deletedEvent.date}`);
          console.log('Event deleted:', deletedEvent);
        } else {
          bot.sendMessage(chatId, 'Event not found. Please check the city name and description.');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        bot.sendMessage(chatId, 'Error deleting event. Please try again.');
      }
    } else {
      bot.sendMessage(chatId, 'Invalid format. Please use: /deleteevent City/Exact Description');
    }
  });

  //Fetch events
  async function getEvents() {
    try {
      return await Event.find();
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

function initializeBot() {
    // This function can be used to set up any initial configurations
    console.log('Telegram bot initialized');
  }
  
  export { bot, getEvents, initializeBot };