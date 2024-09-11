import React, { useEffect, useState } from 'react';
import { fetchExchangeRate } from '../../services/currencyService.js';

const Currency = ({ countryCode }) => {
  const [exchangeRate, setExchangeRate] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getExchangeRate = async () => {
      if (countryCode) {
        setIsLoading(true);
        try {
          const data = await fetchExchangeRate(countryCode);
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
    return typeof rate === 'number' ? rate.toFixed(4) : parseFloat(rate).toFixed(4);
  };

  const getLocalCurrencyForUSD = () => {
    if (exchangeRate && exchangeRate.exchange) {
      const usdRate = exchangeRate.exchange.find(item => item.code === 'USD');
      if (usdRate) {
        // Invert the rate to get local currency per 1 USD
        return 1 / parseFloat(usdRate.rate);
      }
    }
    return null;
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
          {exchangeRate.base_code && getLocalCurrencyForUSD() ? (
            <>
              <p>1 USD = {formatRate(getLocalCurrencyForUSD())} {exchangeRate.base_symbol} ({exchangeRate.base_code})</p>
              <p>Last updated: {new Date(exchangeRate.exchange.find(item => item.code === 'USD').last_update_unix * 1000).toLocaleString()}</p>
            </>
          ) : (
            <p>USD exchange rate not available for this currency.</p>
          )}
        </div>
      ) : (
        <p>No exchange rate data available.</p>
      )}
    </section>
  );
};

export default Currency;