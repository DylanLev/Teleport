// front/src/components/functionalities/News.jsx

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchNews } from '../../api/newsApi.js';

const News = ({ countryName, countryCode }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getNews = async () => {
      try {
        setLoading(true);
        const newsData = await fetchNews(countryCode);
        setNews(newsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch news');
        setLoading(false);
      }
    };

    getNews();
  }, [countryCode]);

  if (loading) return <p>Loading news...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="news">
      <h2>Current Events in {countryName}</h2>
      {news.length > 0 ? (
        <ul className="news-list">
          {news.map((article) => (
            <li key={article.uuid} className="news-item">
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No news available at the moment.</p>
      )}
    </section>
  );
};

News.propTypes = {
  countryName: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
};

export default News;