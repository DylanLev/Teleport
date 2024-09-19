import TelegramBot from "node-telegram-bot-api";
import { validateDate, formatDate } from '../date.js'; 
import { telegramBotUri } from '../config.js';  // Adjust the path as necessary
import Event from '../../models/eventModel.js';
import Group from "../../models/groupModel.js";

//------------TELEGRAM API--------------------------
const bot = new TelegramBot(telegramBotUri, { polling: true });

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const commands = [
    '- Create a new event: /createevent City/Description/DDMMYY/"Link"\n',
    '- Delete an existing event: /deleteevent City/Exact Description\n',
    '- Create a new group: /creategroup Name/Category/"Link"\n',
    '- Delete an existing group: /deletegroup Name\n',
    '- Show all events: /getevents\n',
    '- Show all groups: /getgroups\n'
  ];

  const helpMessage = 'Available commands:\n\n' + commands.join('\n');
  bot.sendMessage(chatId, helpMessage);
});


//------- EVENTS ------------
//Create event
bot.onText(/\/createevent (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const eventData = match[1].split(/\/(?=(?:[^"]*"[^"]*")*[^"]*$)/);
  if (eventData.length === 4) {
    const [city, description, date, link] = eventData;
    
    if (!city || !description || !date) {
      bot.sendMessage(chatId, 'Invalid format. Please use: /createevent City/Description/DDMMYY/"Link"');
      return;
    }

    if (!validateDate(date)) {
      bot.sendMessage(chatId, 'Invalid date format. Please use DDMMYY.');
      return;
    }

    const formattedDate = formatDate(date);
    const cleanLink = link.replace(/^"|"$/g, '').trim(); // Remove surrounding quotes
    
    try {
      const newEvent = new Event({ city, description, date: formattedDate, link: cleanLink });
      await newEvent.save();
      bot.sendMessage(chatId, 'Event created successfully!');
      console.log('New event created:', newEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      bot.sendMessage(chatId, 'Error creating event. Please try again.');
    }
  } else {
    bot.sendMessage(chatId, 'Invalid format. Please use: /createevent City/Description/DDMMYY/"Link"');
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

  // Get all events
bot.onText(/\/getevents/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const events = await getEvents();
    if (events.length > 0) {
      const eventList = events.map(event => 
        `${event.city} - ${event.description} on ${event.date}${event.link ? ` (${event.link})` : ''}`
      ).join('\n');
      bot.sendMessage(chatId, `All events:\n\n${eventList}`);
    } else {
      bot.sendMessage(chatId, 'No events found.');
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    bot.sendMessage(chatId, 'Error fetching events. Please try again.');
  }
});
//------- EVENTS --------

//------- GROUPS -------------------------
// Create group
bot.onText(/\/creategroup (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const groupData = match[1].split(/\/(?=(?:[^"]*"[^"]*")*[^"]*$)/);
  if (groupData.length === 3) {
    const [name, category, link] = groupData;
    
    if (!name || !category) {
      bot.sendMessage(chatId, 'Invalid format. Please use: /creategroup Name/Category/"Link"');
      return;
    }

    const cleanLink = link.replace(/^"|"$/g, '').trim(); // Remove surrounding quotes
    
    try {
      const newGroup = new Group({ name, category, link: cleanLink });
      await newGroup.save();
      bot.sendMessage(chatId, 'Group created successfully!');
      console.log('New group created:', newGroup);
    } catch (error) {
      console.error('Error creating group:', error);
      bot.sendMessage(chatId, 'Error creating group. Please try again.');
    }
  } else {
    bot.sendMessage(chatId, 'Invalid format. Please use: /creategroup Name/Category/"Link"');
  }
});

// Delete group
bot.onText(/\/deletegroup (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const groupName = match[1].trim();
  
  try {
    const deletedGroup = await Group.findOneAndDelete({ name: groupName });

    if (deletedGroup) {
      bot.sendMessage(chatId, `Group deleted successfully: ${deletedGroup.name}`);
      console.log('Group deleted:', deletedGroup);
    } else {
      bot.sendMessage(chatId, 'Group not found. Please check the group name.');
    }
  } catch (error) {
    console.error('Error deleting group:', error);
    bot.sendMessage(chatId, 'Error deleting group. Please try again.');
  }
});

// Get all groups
bot.onText(/\/getgroups/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const groups = await getGroups();
    if (groups.length > 0) {
      const groupList = groups.map(group => 
        `${group.name} (${group.category})${group.link ? ` - ${group.link}` : ''}`
      ).join('\n');
      bot.sendMessage(chatId, `All groups:\n\n${groupList}`);
    } else {
      bot.sendMessage(chatId, 'No groups found.');
    }
  } catch (error) {
    console.error('Error fetching groups:', error);
    bot.sendMessage(chatId, 'Error fetching groups. Please try again.');
  }
});

// Add a function to fetch groups
async function getGroups() {
  try {
    return await Group.find();
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
}



function initializeBot() {
    // This function can be used to set up any initial configurations
    console.log('Telegram bot initialized');
  }
  
  export { bot, getEvents, getGroups, initializeBot };