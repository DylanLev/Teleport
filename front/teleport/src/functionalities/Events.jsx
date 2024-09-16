// Events.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../functionalities/Events.module.scss';


const Events = () => {
  const [events, setEvents] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
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

  return (
    <div className={styles.events}>
      <h2>Upcoming Events</h2>
      <div className={styles.scrollContainer} ref={scrollRef}>
        {events.map(event => (
          <div 
            key={event._id} 
            className={styles.eventCard}
          >
            <h3 className={styles.eventName}>{event.description}</h3>
            <p>Location: {event.city}</p>
            <p className={styles.date}>Date: {event.date}</p>

</div>
        ))}
      </div>
      <button onClick={() => scrollContent('left')} className="scroll-button left">←</button>
      <button onClick={() => scrollContent('right')} className="scroll-button right">→</button>
    </div>
  );
};

export default Events;