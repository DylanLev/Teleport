import React, { useEffect, useState } from 'react';
import { fetchExchangeRate } from '../../services/currencyService';
import currencyMap from '../../../../back/config/currencies';

const Currency = ({ countryCode }) => {
  const [exchangeRate, setExchangeRate] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getExchangeRate = async () => {
      if (countryCode) {
        setIsLoading(true);
        const currencyCode = getCurrencyCode(countryCode);
        
        try {
          const data = await fetchExchangeRate(currencyCode);
          setExchangeRate(data);
          setError(null);
        } catch (err) {
          console.error('Error fetching exchange rate:', err);
          setError('Failed to load exchange rate data');
        } finally {
          setIsLoading(false);
        }
      }
    };

    getExchangeRate();
  }, [countryCode]);

  const formatRate = (rate) => {
    return typeof rate === 'number' ? rate.toFixed(4) : 'N/A';
  };

  const getCurrencyCode = (countryCode) => {
    return currencyMap[countryCode.toUpperCase()];
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="currency">
      <h2>Exchange Rate</h2>
      {isLoading ? (
        <p>Loading exchange rate data...</p>
      ) : exchangeRate ? (
        <div>
          <p>
            1 {exchangeRate.base_code} ≈ {formatRate(exchangeRate.conversion_rate)} {exchangeRate.target_code}
          </p>
          <p>Last updated: {exchangeRate.time_last_update_utc}</p>
        </div>
      ) : (
        <p>No exchange rate data available.</p>
      )}
    </section>
  );
};

export default Currency;