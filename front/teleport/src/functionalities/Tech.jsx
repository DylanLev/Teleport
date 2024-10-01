import React, { useState, useEffect } from 'react';

const Tech = () => {
  const [articles, setArticles] = useState([]);
  const [titleColors, setTitleColors] = useState([]);
  const [showThirdArticle, setShowThirdArticle] = useState(false);
  const URL = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&excludeCategories=Altcoin';

  const colorPalette = ['#ff6b6b', '#4ecdc4', '#ffffff', '#cccccc'];

  const getRandomColor = () => {
    return colorPalette[Math.floor(Math.random() * colorPalette.length)];
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${URL}&api_key=${import.meta.env.VITE_CRYPTOTECH}`);
        const data = await response.json();
        
        const getUniqueArticles = (allArticles, count) => {
          const uniqueArticles = [];
          const seenPublishDates = new Set();
          
          for (const article of allArticles) {
            if (!seenPublishDates.has(article.published_on)) {
              uniqueArticles.push(article);
              seenPublishDates.add(article.published_on);
              
              if (uniqueArticles.length === count) break;
            }
          }
          
          return uniqueArticles;
        };

        const fetchedArticles = getUniqueArticles(data.Data, 3);
        setArticles(fetchedArticles);
        
        const colors = fetchedArticles.map(() => getRandomColor());
        setTitleColors(colors);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const truncateText = (text, lines = 3) => {
    const words = text.split(' ');
    const truncated = words.slice(0, lines * 8).join(' ');
    return truncated + (words.length > lines * 8 ? '...' : '');
  };

  return (
    <section className="tech" style={{ backgroundColor: '#121212', color: '#ffffff', padding: '1rem' }}>
      <h2 style={{ color: '#4ecdc4' }}>Tech News</h2>
      {articles.slice(0, 2).map((article, index) => (
        <article key={article.id} style={{ backgroundColor: '#2c2c2c', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
          <h3 style={{ color: titleColors[index] }}>{article.title}</h3>
          <p style={{ color: '#cccccc' }}>{truncateText(article.body)}</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: '#4ecdc4', textDecoration: 'none' }}>Read more</a>
        </article>
      ))}
      {!showThirdArticle && articles.length > 2 && (
        <button 
          onClick={() => setShowThirdArticle(true)}
          style={{
            backgroundColor: 'black',
            color: 'white',
            border: '2px solid white',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Show More
        </button>
      )}
      {showThirdArticle && articles[2] && (
        <article style={{ backgroundColor: '#2c2c2c', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
          <h3 style={{ color: titleColors[2] }}>{articles[2].title}</h3>
          <p style={{ color: '#cccccc' }}>{truncateText(articles[2].body)}</p>
          <a href={articles[2].url} target="_blank" rel="noopener noreferrer" style={{ color: '#4ecdc4', textDecoration: 'none' }}>Read more</a>
        </article>
      )}
    </section>
  );
};

export default Tech;