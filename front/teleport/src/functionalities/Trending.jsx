import React, { useRef } from 'react';
import styles from "./Trending.module.scss";

const Trending = () => {
  const scrollRef = useRef(null);

  const trendingTopics = [
    { id: 1, name: "Why daily routines make you poor & fragile", content: 'In this video, Alex Hormozi, owner of Acquisition.com, discusses key components for business growth: skills, character traits, and beliefs. He emphasizes that many entrepreneurs fail to grow because they focus on adding potential without addressing their constraints—the bottlenecks that limit progress.Rosie shares insights from a dinner with young entrepreneurs, highlighting two limiting character traits they expressed: anxiety and an "all or nothing" mentality. He stresses the importance of language and self-perception, noting that statements like "I am anxious" can become self-fulfilling prophecies. Instead, he encourages reframing these beliefs to promote growth.He also warns against relying on routines and superstitions that can weaken resilience. For instance, dependence on substances or rituals to function can create crutches that hinder performance. Rosie advocates for flexibility in habits to maintain effectiveness.Be mindful of self-descriptive statements; they shape your identity and beliefs.Avoid rigid routines and superstitions that undermine your strength and adaptability.', hashtag: "Alex Hormozi" },
    { id: 2, name: "AI in Finance", content: "Technology", hashtag: "#AIFinance" },
    { id: 3, name: "DeFi", content: "Blockchain", hashtag: "#DeFi" },
    { id: 4, name: "NFT Art", content: "Digital Assets", hashtag: "#NFTArt" },
    { id: 5, name: "Ethereum 2.0", content: "Cryptocurrency", hashtag: "#Ethereum2" },
    { id: 6, name: "Metaverse", content: "Virtual Reality", hashtag: "#Metaverse" },
    { id: 7, name: "Green Crypto", content: "Sustainability", hashtag: "#GreenCrypto" },
    { id: 8, name: "Web3", content: "Internet", hashtag: "#Web3" },
  ];

  const scrollContent = (direction) => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -containerWidth : containerWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.scrollWidget}>
      <h2>Trending Topics</h2>
      <div className={styles.scrollContainer} ref={scrollRef}>
        {trendingTopics.map(topic => (
          <div key={topic.id} className={styles.trendingCard}>
            <h4>{topic.name}</h4>
            <p>{topic.content}</p>
            <p className={styles.hashtag}>{topic.hashtag}</p>
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

export default Trending;