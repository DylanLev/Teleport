import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../functionalities/Events.module.scss';

const API_URL = 'http://localhost:5000/api/events';

const Events = () => {
  const [events, setEvents] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(API_URL);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const scrollContent = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleEventClick = (link) => {
    if (link) {
      // Remove surrounding quotes if present
      const cleanLink = link.replace(/^["']|["']$/g, '');
      // Check if it's a valid URL
      if (/^https?:\/\//.test(cleanLink)) {
        window.open(cleanLink, '_blank', 'noopener,noreferrer');
      } else {
        console.warn('Invalid URL:', cleanLink);
      }
    }
  };

  return (
    <div className={styles.events}>
      <h2>Upcoming Events</h2>
      <div className={styles.scrollContainer} ref={scrollRef}>
        {events.map(event => (
          <div 
            key={event._id} 
            className={styles.eventCard}
          >
            <h3 
              className={`${styles.eventName} ${event.link ? styles.clickable : ''}`}
              onClick={() => handleEventClick(event.link)}
            >
              {event.description}
            </h3>
            <p>Location: {event.city}</p>
            <p className={styles.date}>Date: {event.date}</p>
            {event.link && (
              <a 
                href={event.link.replace(/^["']|["']$/g, '')} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.eventLink}
              >
                Event Details
              </a>
            )}
          </div>
        ))}
      </div>
      <button onClick={() => scrollContent('left')} className={`${styles.scrollButton} ${styles.left}`}>←</button>
      <button onClick={() => scrollContent('right')} className={`${styles.scrollButton} ${styles.right}`}>→</button>
    </div>
  );
};

export default Events;