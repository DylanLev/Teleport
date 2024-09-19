import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import telegramIcon from '../../public/icons/telegram.png';
import styles from "./Groups.module.scss";

const API_URL = 'http://localhost:5000/api/groups';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(API_URL);
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
    const interval = setInterval(fetchGroups, 5000); // Poll every 5 seconds

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

  return (
    <div className={styles.scrollWidget}>
      <h2>Exclusive Groups</h2>
      <div className={styles.scrollContainer} ref={scrollRef}>
        {groups.map(group => (
          <div key={group._id} className={styles.groupCard}>
            <h4>{group.name}</h4>
            <p>Category: {group.category}</p>
            {group.link && (
              <a href={group.link} target="_blank" rel="noopener noreferrer" className={styles.telegramLink}>
                <img src={telegramIcon} alt="Telegram" className={styles.telegramIcon} />
                Join Group
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

export default Groups;