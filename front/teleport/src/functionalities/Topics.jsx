import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './Topics.module.scss';

const API_URL = 'http://localhost:5000/api/topics';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(API_URL);
        setTopics(response.data.reverse());
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
    const fetchInterval = setInterval(fetchTopics, 5000); // Poll every 5 seconds

    return () => clearInterval(fetchInterval);
  }, []);

  useEffect(() => {
    const autoScroll = () => {
      if (topics.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % topics.length);
      }
    };

    const scrollInterval = setInterval(autoScroll, 12000); // Auto-scroll every 12 seconds

    return () => clearInterval(scrollInterval);
  }, [topics]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: currentIndex * scrollRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  const scrollContent = (direction) => {
    if (scrollRef.current) {
      const newIndex = direction === 'left' 
        ? (currentIndex - 1 + topics.length) % topics.length 
        : (currentIndex + 1) % topics.length;
      setCurrentIndex(newIndex);
    }
  };

  const renderContent = (content) => {
    if (!content) return '';
    const lines = content.split('\n');
    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const cleanLink = (link) => {
    return link ? link.replace(/^["']|["']$/g, '').trim() : '';
  };

  const isYoutubeLink = (link) => {
    if (!link) return false;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(link);
  };

  return (
    <div className={styles.scrollWidget}>
      <h2>Trending Topics</h2>
      <div className={styles.scrollContainer} ref={scrollRef}>
        {topics.map((topic, index) => (
          <div 
            key={topic._id} 
            className={styles.trendingCard}
            style={{
              transform: `translateX(${(index - currentIndex) * 100}%)`,
              transition: 'transform 0.5s ease-in-out'
            }}
          >
            {topic.link ? (
              <a 
                href={cleanLink(topic.link)}
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${styles.topicTitle} ${styles.clickable}`}
              >
                {topic.title}
              </a>
            ) : (
              <h4 className={styles.topicTitle}>{topic.title}</h4>
            )}
            <div className={styles.topicContent}>
              {renderContent(topic.content)}
            </div>
            <p className={styles.author}>
              {topic.author}
              <span className={styles.via}>
                {' '}via {topic.link ? (isYoutubeLink(cleanLink(topic.link)) ? 'Youtube' : 'X') : 'X'}
              </span>
            </p>
          </div>
        ))}
      </div>
      <button 
        onClick={() => scrollContent('left')} 
        className={`${styles.scrollButton} ${styles.left}`}
        aria-label="Scroll left"
      ></button>
      <button 
        onClick={() => scrollContent('right')} 
        className={`${styles.scrollButton} ${styles.right}`}
        aria-label="Scroll right"
      ></button>
    </div>
  );
};

export default Topics;